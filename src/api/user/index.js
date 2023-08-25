import { Service } from '@/api/request'

// 教师登录
export function loginTeacher(params) {
    return Service({
        url: '/api/teacher/login',
        method: 'post',
        data: params
    })
}
// 学生登录
export function loginStudent(params) {
    return Service({
        url: '/api/student/login',
        method: 'post',
        data: params
    })
}

// 教师列表
export function studentTeacherList(params) {
    return Service({
        url: '/api/student/teacher_list',
        method: 'post',
        data: params
    })
}

// 关注教师
export function studentWatchTeacher(params) {
    return Service({
        url: '/api/student/watch_teacher',
        method: 'post',
        data: params
    })
}

// 取消关注教师
export function studentUnWatchTeacher(params) {
    return Service({
        url: '/api/student/unwatch_teacher',
        method: 'post',
        data: params
    })
}

// 关注教师列表
export function studentWatchTeacherList(params) {
    return Service({
        url: '/api/student/watch_teacher_list',
        method: 'post',
        data: params
    })
}


// 学生列表
export function studentList(params) {
    return Service({
        url: '/api/teacher/student_list',
        method: 'post',
        data: params
    })
}
// 学生关注列表
export function studentWatchedList(params) {
    return Service({
        url: '/api/teacher/watched_student',
        method: 'post',
        data: params
    })
}

// 学校列表
export function schoolList() {
    return Service({
        url: '/api/teacher/school_list',
        method: 'post',
    })
}

// 学校教师列表
export function schoolTeacherList(params) {
    return Service({
        url: '/api/teacher/school_teacher_list',
        method: 'post',
        data: params
    })
}
// 创建学校
export function createSchool(params) {
    return Service({
        url: '/api/teacher/create_school',
        method: 'post',
        data: params
    })
}
// 邀请教师
export function inviteTeacher(params) {
    return Service({
        url: '/api/teacher/invite',
        method: 'post',
        data: params
    })
}

//教师绑定ws
export const wkBindTeacher = (params) => {
    return Service({
        url: '/api/teacher/wk_bind',
        method: 'post',
        params: params
    })
}

//教师发消息给学生
export const wkSendStudent = (params) => {
    return Service({
        url: '/api/teacher/send_meg_to_student',
        method: 'post',
        params: params
    })
}

//教师获取历史消息
export const getHistoryMessage = (params) => {
    return Service({
        url: '/api/teacher/get_history_message',
        method: 'post',
        params: params
    })
}
//教师获取消息用户
export const getMessageUser = () => {
    return Service({
        url: '/api/teacher/get_message_user',
        method: 'post',
    })
}

//学生绑定ws
export const wkBindStudent = (params) => {
    return Service({
        url: '/api/student/wk_bind',
        method: 'post',
        params: params
    })
}

//学生发消息给教师
export const wkSendTeacher = (params) => {
    return Service({
        url: '/api/student/send_meg_to_teacher',
        method: 'post',
        params: params
    })
}
//学生获取历史消息
export const getStudentHistoryMessage = (params) => {
    return Service({
        url: '/api/student/get_history_message',
        method: 'post',
        params: params
    })
}
//学生获取消息用户
export const getStudentMessageUser = () => {
    return Service({
        url: '/api/student/get_message_user',
        method: 'post',
    })
}
