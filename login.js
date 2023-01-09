const button = document.querySelector('button')
const email = document.getElementById('email')
const domainName = document.getElementById('domainName')
const apiKey = document.getElementById('apiKey')

if (localStorage.getItem('domainName') && !localStorage.getItem('issueKey')) {
    window.open('search.html', '_self')
} else if (localStorage.getItem('domainName') && localStorage.getItem('issueKey')) {
    window.open('index.html', '_self')
}

button.addEventListener('click', async () => {
    try {
        const response = await fetch(`https://${domainName.value}.atlassian.net/rest/api/3/project`)
        const result = await response.json()
        if (result.length > 0) {
            localStorage.setItem('domainName', domainName.value)
            window.open('search.html', '_self')
        } else {
            alert('invalid creds')
        }
    } catch (e) {
        console.log(e)
    }
})