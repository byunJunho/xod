import R from 'ramda';
import path from 'path';
import { hasNot } from 'xod-core';
import { readDir, readJSON, readFile } from './read';
import expandHomeDir from 'expand-home-dir';

const implAccordance = {
  js: 'xod.js',
  espruino: 'espruino.js',
};

const implTypes = Object.keys(implAccordance);

const getPatchName = (metaPath) => {
  const parts = metaPath.split(path.sep);
  return parts[parts.length - 2];
};

const isXodPatchFile = (filename) => {
  const ext = path.extname(filename);
  return (ext === '.xodp');
};

const isXodMetaFile = (filename) => {
  const ext = path.extname(filename);
  return (ext === '.xodm');
};

const isXodFile = R.anyPass([isXodMetaFile, isXodPatchFile]);

const scanLibsFolder = (libs, libsDir) => Promise.all(
  libs.map(
    lib => readDir(path.resolve(libsDir, lib))
      .then(R.filter(isXodFile))
      .catch(err => {
        throw Object.assign(err, {
          path: path.resolve(libsDir, lib),
          libName: lib,
        });
      })
  ))
  .then(R.zipObj(libs));

const replaceNodeTypeIdWithLibName = R.curry(
  (name, node) => {
    const typeId = R.prop('typeId', node);

    if (typeId[0] !== '@') { return node; }
    const newTypeId = typeId.replace(/@/, name);

    return R.assoc('typeId', newTypeId, node);
  }
);

const readLibFiles = (libfiles) => {
  const libNames = Object.keys(libfiles);
  let libPromises = [];

  libNames.forEach(name => {
    const files = libfiles[name];

    libPromises = libPromises.concat(
      files.map(patchPath =>
        readJSON(patchPath)
          .then(loaded => {
            const data = R.assoc('id', `${name}/${getPatchName(patchPath)}`, loaded);

            if (hasNot('nodes', data)) {
              return R.assoc('impl', {}, data);
            }

            return R.evolve(
              {
                nodes: R.mapObjIndexed(replaceNodeTypeIdWithLibName(name)),
              },
              data
            );
          })
      )
    );
  });

  return Promise.all(libPromises);
};
const loadImpl = libsDir => metas => {
  const metaPromises = [];

  metas.forEach(meta => metaPromises.push(
    new Promise(resolve => {
      const patchDir = path.resolve(libsDir, meta.id);
      const implPromises = implTypes.map(type => {
        const implPath = path.resolve(patchDir, implAccordance[type]);
        return readFile(implPath)
          .then(data => ([type, data]))
          .catch(err => {
            if (err && err.code === 'ENOENT') {
              return [type, null];
            }

            throw Object.assign(err, { path: implPath, type });
          });
      });

      Promise.all(implPromises)
        .then(impls => {
          const notEmptyImpls = {};
          // remove null implementations
          impls.forEach(impl => {
            if (impl[1] !== null) {
              notEmptyImpls[impl[0]] = impl[1];
            }
          });

          return notEmptyImpls;
        })
        .then(impl => {
          meta.impl = impl; // eslint-disable-line
          return resolve(meta);
        });
    })
  ));

  return Promise.all(metaPromises);
};

// :: libs [patch_1_Meta, patch_1_Content] -> mergedLibs [patch_1]
const mergePatchesAndMetas = R.pipe(
  R.groupBy(R.prop('id')),
  R.values,
  R.map(R.mergeAll),
  R.flatten
);

export default (libs, workspace) => {
  const libsDir = path.resolve(expandHomeDir(workspace), 'lib');
  return scanLibsFolder(libs, libsDir)
    .then(readLibFiles)
    .then(mergePatchesAndMetas)
    .then(loadImpl(libsDir))
    .then(R.indexBy(R.prop('id')));
};
