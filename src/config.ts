import { useDark, useToggle } from '@vueuse/core'

// FIXME
export const isDark = useDark()
export const toggleDark = useToggle(isDark)
export { useDark }

export const loc = localStorage

export const baseURL = 'http://192.168.206.128:8000'
export const projAddr = 'https://github.com/Ro0tk1t/driver-front'


export async function resetToken() {
    loc.setItem('token', '')
}