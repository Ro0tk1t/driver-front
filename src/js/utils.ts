import axios, { AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { resetToken } from '../config'

export async function post(path: string, data: any, headers: any): Promise<AxiosResponse> {
    try {
        const ret = await axios.post(path, data, headers)
        return ret
    } catch (err: any) {
        if (err.response.status == 401) {
            ElMessage.error('请先登录')
            await resetToken()
            setTimeout(() => {
                window.location.href = '/login'
            }, 666)
        } else {
            ElMessage.error("服务器连接失败")
        }
        return err.response
    }
}

export const get = async (path: string, datas: any): Promise<AxiosResponse<any, any>> => {
    try {
        const ret = await axios.get(path, datas)
        return ret
    } catch (err: any) {
        console.log(err)
        if (err.response.status == 401) {
            ElMessage.error('请先登录')
            await resetToken()
            await setTimeout(() => {
                window.location.href = '/login'
            }, 666)
        } else {
            ElMessage.error("服务器连接失败")
        }
        return err.response
    }
}