const key = 'previousTodoLists';

localStorage.setItem(
  key,
  JSON.stringify([
    {
      id: 'ad60cc5c-b64d-4b40-803e-cff7710852ee',
      title: '',
    },
    {
      id: 'ad60cc5c-b64d-4b40-803e-cff7710852ee',
      title: 'Feb 20, 2023 (ad60cc5c)',
    },
    {
      id: 'ad60cc5c-b64d-4b40-803e-cff7710852ee',
      title:
        'Feb 20, 2023 (ad60cc5c) 123123l,123l;,13l;1,23 ;l12,3l;1 2,3;l12,3;l1',
    },
  ]),
);

export const getPreviousTodoLists = () => {
  return JSON.parse(localStorage.getItem('previousTodoLists') || '{}');
};

export const removeTodoList = () => {};

export const addTodoList = () => {};
