// (
const backButton = document.getElementById('back')
const logoutButton = document.getElementById('logout')
backButton.addEventListener('click', () => {
    localStorage.removeItem('issueKey')
    window.open('search.html', '_self')
})
logoutButton.addEventListener('click', () => {
    localStorage.clear()
    window.open('login.html', '_self')
})

chrome.runtime.sendMessage(
    {domainName: localStorage.getItem('domainName'), issueKey: localStorage.getItem('issueKey')}, data => console.log(data)
)

let timer;
    async function kek() {
        clearTimeout(timer);
        chrome.runtime.sendMessage(
            {message: 'Service worker is working...'}, data => console.log(data)
        )
        const container = document.getElementById('container')
        const { tabs } = await chrome.storage.sync.get("tabs");
        if (tabs) {
            let str = ''
            tabs.forEach(tab => {
                str += `
            <ul>
                <li>tabId ~ ${tab.id}</li>
                <li>tab title ~ ${tab.title}</li>
                <li>is active ~ ${tab.active}</li>
                <li>url ~ ${tab.url}</li>
                <li>focused ~ ${tab.focused}</li>
            </ul>
            `
            })
            if (container) {
                container.innerHTML = str
            }
        }
        timer = setTimeout(kek, 3000);
    }
// )()
window.addEventListener('load', kek, false)