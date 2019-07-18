export const findFolder = (folders = [], folderId) =>
  folders.find(folder => folder.folderid === folderId);

export const findNote = (notes = [], noteId) =>
  notes.find(note => note.noteid === noteId);

export const getNotesForFolder = (notes = [], folderId) =>
  !folderId ? notes : notes.filter(note => note.folderid === folderId);

export const countNotesForFolder = (notes = [], folderId) =>
  notes.filter(note => note.folderid === folderId).length;
