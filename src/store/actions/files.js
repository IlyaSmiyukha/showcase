import * as types from '@/store/types/files';
import AwsUploader from '@/api/aws';
import store from '@/store/store';

import {getUsers} from './users';
import {getUsers as getUsersState} from '@/store/selectors/users';

export const fetchUrls = async (
  client,
  fileIds,
  group = null,
  rfcId = null,
) => {
  try {
    const chunks = _.chunk(fileIds, 100);
    const files = [];
    for (const ids of chunks) {
      const request = {
        ids,
        format_output: 'thumbs',
      };

      if(group) {
        request.group = group;
      }

      if(rfcId) {
        request.security_params = {
          links: {
            rfc: rfcId,
          },
        };
      };

      const response = ids.length
        ? await client.post('/files/get-urls', request)
        : [];

      files.push(...response);
    }
    return files;
  } catch (error) {
    console.log(error);
  }
};

export const fetchMyFiles = ({offset, search , filesList, type, currentUserId}) => {
  return {
    routine: types.fetchMyFiles,
    promise: client => new Promise(async (resolve, reject) => {
      const filter = {
        search,
        exclude_vapps: true,
        exclude_folder_files: true,
        type: ['performance',
          'video',
          'image',
          'document',
          'file',
          'folder',
          'project',
          'audio'],
        exclude_tags: [
          {
            'system:Category': 'meeting',
          },
          {
            'system:Category': 'showtime',
          },
        ],
      };

      if (filesList) {
        filter.ids = filesList;
      }

      if (type) {
        filter.type = type;
      }

      try {
        let {
          files = [],
          total_files,
        } = await client.post('/files/list/mine', {
          sort: 'created',
          sort_direction: 'desc',
          offset,
          filter,
          limit: 25,
        });

        const folders = files.filter(file => file.type === 'folder');

        const folderFileIds = folders.reduce((acc, folder) => {
          const folderFilesLists = folder.extra.folder.items.reverse();
          return [...acc,
            folderFilesLists[0] && folderFilesLists[0].type !== 'folder' ? folderFilesLists[0].id : '',
            folderFilesLists[1] && folderFilesLists[1].type !== 'folder' ? folderFilesLists[1].id : ''];
        }, []).filter(item => !!item);

        const filesIds = files.map((item) => {
          return item.file_id;
        });

        const userId = (files.length && files[0].user_id) || currentUserId;

        const [author] = await client.post('/user/get', {
          ids: [userId],
        });

        store.dispatch(getUsers({[userId] : author}));

        const thumbs = await fetchUrls(client, [...filesIds,
          ...folderFileIds]);

        files = files.map(file => {

          const [{
            urls,
          }] = thumbs.filter(thumb => thumb.file_id === file.file_id);

          return {
            ...file,
            urls,
            owner_data: author,
          };

        });

        const folderFiles = folderFileIds.map(file => ({
          owner_data: author,
          ...thumbs.find(thumb => thumb.file_id === file),
        }));

        resolve({
          files,
          total_files,
          search,
          filesList,
          folderFiles,
          type
        });
      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const fetchSharedFiles = ({offset, search , folderId, filesList, type}) => {
  return {
    routine: types.fetchSharedFiles,
    promise: client => new Promise(async (resolve, reject) => {
      const filter = {
        search,
        exclude_vapps: true,
        exclude_folder_files: false,
        type: ['performance',
          'video',
          'image',
          'document',
          'file',
          'folder',
          'audio'],
      };

      if (folderId) {
        filter.folder_id = folderId;
      }

      if (filesList) {
        filter.ids = filesList;
      }

      if (type) {
        filter.type = type;
      }

      try {
        let {
          files = [],
          total_files,
        } = await client.post('/files/list/shared', {
          sort: 'created',
          sort_direction: 'desc',
          offset,
          filter,
          limit: 25,
        });

        const filesIds = files.map((item) => {
          return item.file_id;
        });

        const userId = files.length && files[0].user_id;

        const [author] = await client.post('/user/get', {
          ids: [userId],
        });

        store.dispatch(getUsers({[userId] : author}));

        const thumbs = await fetchUrls(client, filesIds);

        files = files.map(file => {

          const [{
            urls,
          }] = thumbs.filter(thumb => thumb.file_id === file.file_id);

          return {
            ...file,
            urls,
            owner_data: author,
          };

        });

        resolve({
          files,
          total_files,
          search,
          folderId,
          filesList,
          type
        });
      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const fetchFolder = ({offset, folderId, type, getFullInfo}) => {
  return {
    routine: types.fetchFolder,
    promise: client => new Promise(async (resolve, reject) => {
      const filter = {
        folder_id: folderId,
        type: type || ['performance',
          'video',
          'audio',
          'image',
          'file',
          'project',
          'document',
          'folder'],
      };

      try {
        let filesResult = [];

        const params = {
          sort: 'created',
          sort_direction: 'desc',
          offset,
          filter,
        }

        if (!getFullInfo) {
          params['limit'] = 25
        }

        let {
          files = [],
          total_files,
        } = await client.post('/files/list/folder', params);

        filesResult = [ ...files]

        if (getFullInfo) {
          while (total_files > filesResult.length) {
            let {
              files = [],
              total_files,
            } = await client.post('/files/list/folder', {
              ...params,
              offset: filesResult.length
            });
            filesResult = [...filesResult, ...files]
          }
        }

        const filesIds = filesResult.map((item) => {
          return item.file_id;
        });

        let usersData = getUsersState(store.getState());

        const userIdsNotInStore = files.length && _.uniq(filesResult.map(file => file.user_id)).filter(user => !usersData[user]);

        if (userIdsNotInStore.length) {
          const newUsers = await client.post('/user/get', {
            ids: userIdsNotInStore,
          });

          const newUsersList = newUsers.reduce((acc, user) => {
             acc[user.user_id] = user
             return acc
           }, {})

           usersData = {
             ...usersData,
             ...newUsersList
           }

          store.dispatch(getUsers(newUsersList));
        }

        filesResult = filesResult.map(file =>  ({
            ...file,
            owner_data: usersData[file.user_id],
          }));

        resolve({
          files: filesResult,
          total_files,
          folderId,
        });
      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const trackUploadProgress = (fileId, progress) => {
  return {
    type: types.trackUploadProgress.SUCCESS,
    payload: {
      fileId,
      progress,
    },
  };
};

export const trackProcessingProgress = (fileId, progress) => {
  return {
    type: types.trackProcessingProgress.SUCCESS,
    payload: {
      fileId,
      progress,
    },
  };
};

export const uploadFile = (file, group, folderId) => {
  return {
    routine: types.uploadFile,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        const params = {
          filesize: file.size,
          mime_type: file.type,
          original_filename: file.name
        };

        if (folderId) {
          params.folder_id = folderId;
        }

        const data = await client.get(`/files/upload-start`, params);

        const fileName = file.name.split('.')[0];

        await client.post(`/files/edit`, {
          file_id:  data.file_id,
          name: fileName,
        });

        const aws = new AwsUploader(file, data);
        const upload = aws.uploadFile();

        upload.on('httpUploadProgress', progress => {
          const totalProgress = progress.loaded / progress.total * 100;
          store.dispatch(trackUploadProgress(data.file_id, Math.round(totalProgress)));
        });

        upload.promise().then(() => {
          client.post(`/files/upload-finish`, {
            file_id: data.file_id,
            group,
            files: [{
              original_filename: file.name,
              name: fileName,
              path: data.upload_id,
              description: '',
            }],
          }).then(() => {
            resolve({});
          });
        }, error => {
          reject(error);
          console.error(error);
        });

      } catch (error) {
        console.log(error);
        reject(error);
      }
    }),
  };
};

export const clearSearchData = () => {
  return {
    type: types.clearSearchData.SUCCESS,
    payload: false,
  };
};

export const deleteVideoFile = (id) => {
  return {
    type: types.deleteVideoFile.SUCCESS,
    payload: id,
  };
};


export const addFile = (file, group) => {
  return {
    routine: types.addFile,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        let urls = {};
        if (file.status === 'ready') {
          const thumbs = await fetchUrls(client, [file.file_id], group);
          urls = thumbs[0].urls;
        }
        resolve({
          ...file,
          urls,
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    }),
  };
};

export const clearFilesData = () => {
  return {
    type: types.clearFilesData.SUCCESS,
    payload: false,
  };
};

export const fetchFoldersList = () => {
  return {
    routine: types.fetchFoldersList,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        let { folders } = await client.post('/folders/list', {
          sort: 'created',
          sort_direction: 'DESC',
          exclude_tags: [
              {
                  "system:Category": "meeting"
              },
              {
                  "system:Category": "showtime"
              }
          ]
        });
        resolve(folders);

      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const updateFolder = () => {
  return {
    type: types.updateFolder.SUCCESS,
    payload: false,
  };
};
