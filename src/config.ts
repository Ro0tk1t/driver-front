import { ref } from 'vue'

export const loc = localStorage

export const baseURL = 'http://192.168.206.128:8000'
export const projAddr = 'https://github.com/Ro0tk1t/driver-front'


export async function resetToken() {
    loc.setItem('token', '')
}

export const headers = ref({
    // Authorization: localStorage.getItem('token')
    Authorization: "Bearer " + loc.getItem('token')
})

export const isDark = ref(false);
export const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    const classList = document.documentElement.classList;
    if (isDark.value) {
        classList.add('dark');
    } else {
        classList.remove('dark');
    }
};