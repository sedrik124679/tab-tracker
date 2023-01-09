const searchButton = document.getElementById('getIssues')
const searchInput = document.getElementById('searchIssue')
const issueWrapper = document.getElementById('issueWrapper')

async function getIssue(queryValue) {
    const requestURL = `https://${localStorage.getItem('domainName')}.atlassian.net/rest/api/3/issue/picker?query=${queryValue}`
    try {
        const response = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',

            }
        })
        const result = await response.json()
        return result.sections[0].issues
    } catch (e) {
        console.log(e)
    }
}

searchButton.addEventListener('click', async () => {
    try {
        const issues = await getIssue(searchInput.value)

        issues.forEach(issue => {
            const issueButton = document.createElement('button');
            issueButton.textContent = issue.key;
            issueButton.addEventListener('click', () => {
                localStorage.setItem('issueKey', issue.key);

                chrome.storage.sync.set({domainName: localStorage.getItem('domainName')})
                chrome.storage.sync.set({issueKey: localStorage.getItem('issueKey')})

                window.open('index.html', '_self')
            })
            issueWrapper.append(issueButton)
        })
    } catch (e) {
        console.log(e)
    }
})