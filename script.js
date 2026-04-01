const CSV_URL = "https://raw.githubusercontent.com/ritesh-ojha/IPL-DATASET/main/csv/Match_Info.csv"


function showLoading(containerId) {
    const el = document.getElementById(containerId)
    if (!el) return

    el.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `
}


function parseCSV(csv) {
    const lines = csv.trim().split('\n')
    const headers = lines[0].split(',')

    return lines.slice(1).map(line => {
        const values = line.split(',')
        const obj = {}

        headers.forEach((header, i) => {
            obj[header.trim()] = values[i]?.trim()
        })

        return obj
    })
}


async function fetchIPLData() {
    showLoading('stats-container')
    showLoading('players-container')
    showLoading('teams-container') 

    try {
        const cached = localStorage.getItem('iplData')

        if (cached) {
            const data = JSON.parse(cached)
            displayStats(data)
            displayTopPlayers(data)
            displayTopTeams(data) 
            return
        }

        const response = await fetch(CSV_URL)

        if (!response.ok) {
            throw new Error("Failed to fetch data")
        }

        const csv = await response.text()

        if (!csv || csv.length < 10) {
            throw new Error("Invalid data")
        }

        const data = parseCSV(csv)

        localStorage.setItem('iplData', JSON.stringify(data))

        displayStats(data)
        displayTopPlayers(data)
        displayTopTeams(data) 

    } catch (error) {
        console.error(error)

        document.getElementById('stats-container').innerHTML =
            `<p style="color:red;">Error loading stats</p>`

        document.getElementById('players-container').innerHTML =
            `<p style="color:red;">Error loading players</p>`

        const teamEl = document.getElementById('teams-container')
        if (teamEl) {
            teamEl.innerHTML = `<p style="color:red;">Error loading teams</p>`
        }
    }
}


function displayStats(data) {
    const container = document.getElementById('stats-container')
    if (!container) return

    const totalMatches = data.length
    const totalSeasons = [...new Set(data.map(m => m.season))].length
    const teams = [...new Set(data.map(m => m.team1))]
    const totalTeams = teams.length

    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>${totalSeasons}</h3>
                <p>IPL Seasons</p>
            </div>
            <div class="stat-card">
                <h3>${totalMatches}</h3>
                <p>Total Matches</p>
            </div>
            <div class="stat-card">
                <h3>${totalTeams}</h3>
                <p>Teams Participated</p>
            </div>
            <div class="stat-card">
                <h3>2008</h3>
                <p>Founded</p>
            </div>
        </div>
    `
}

function displayTopPlayers(data) {
    const container = document.getElementById('players-container')
    if (!container) return

    const playerCount = {}

    data.forEach(match => {
        const player = match.player_of_match
        if (player) {
            playerCount[player] = (playerCount[player] || 0) + 1
        }
    })

    const topPlayers = Object.entries(playerCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)

    container.innerHTML = `
        <div class="players-grid">
            ${topPlayers.map(([name, count]) => `
                <div class="player-card">
                    <div class="player-avatar">🏏</div>
                    <h4>${name}</h4>
                    <p>${count} Player of Match Awards</p>
                </div>
            `).join('')}
        </div>
    `
}


function displayTopTeams(data) {
    const container = document.getElementById('teams-container')
    if (!container) return

    const winCount = {}

    data.forEach(match => {
        const winner = match.winner
        if (winner) {
            winCount[winner] = (winCount[winner] || 0) + 1
        }
    })

    const topTeams = Object.entries(winCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)

    container.innerHTML = `
        <div class="teams-grid">
            ${topTeams.map(([team, wins]) => `
                <div class="team-card">
                    <div class="team-icon">🏏</div>
                    <h4>${team}</h4>
                    <p>${wins} Wins</p>
                </div>
            `).join('')}
        </div>
    `
}


window.addEventListener("offline", () => {
    alert("You are offline. Showing cached data if available.")
})


fetchIPLData()