import {takeLatest, put, call} from 'redux-saga/effects';
//types
import {
  GET_ALL_TASKS,
  CHANGE_TASK_STATUS,
  REMOVE_TASK_STATUS,
} from './actionTypes';
//actions
import {
  getAllTasksSuccess,
  getAllTasksFail,
  changeStatusTaskSuccess,
  changeStatusTaskFail,
  removeTaskSuccess,
  removeTaskFail,
} from './actions';

//utils
import {toast} from 'react-toastify';

//api
import TasksApis from 'apis/TasksApis';

//get all tasks
function* onGetTasks() {
  try {
    const response = yield call(TasksApis.getTasksApi);
    yield put(getAllTasksSuccess(response));
  } catch (error) {
    yield put(getAllTasksFail(error.response));
  }
}

//change task status
function* onChangeTaskStatus({payload: id, status}) {
  try {
    const response = yield call(TasksApis.changeStatusTaskApi, id, status);
    yield put(changeStatusTaskSuccess(response));
    const res = yield call(TasksApis.getTasksApi);
    yield put(getAllTasksSuccess(res));
  } catch (error) {
    toast.error(error.response.data);
    yield put(changeStatusTaskFail(error.response.data));
  }
}

//Remove task
function* onRemoveTaskStatus({payload: id}) {
  try {
    const response = yield call(TasksApis.deleteTaskByIdApi, id);
    yield put(removeTaskSuccess(response));
    const res = yield call(TasksApis.getTasksApi);
    yield put(getAllTasksSuccess(res));
  } catch (error) {
    toast.error(error.response.data);
    yield put(removeTaskFail(error.response.data));
  }
}

function* TaskSaga() {
  yield takeLatest(GET_ALL_TASKS, onGetTasks);
  yield takeLatest(CHANGE_TASK_STATUS, onChangeTaskStatus);
  yield takeLatest(REMOVE_TASK_STATUS, onRemoveTaskStatus);
}

export default TaskSaga;
