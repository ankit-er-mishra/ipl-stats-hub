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


async function loadTeamsPage() {
    showLoading('teams-page-container')

    try {
        let data

        const cached = localStorage.getItem('iplData')
        if (cached) {
            data = JSON.parse(cached)
        } else {
            const res = await fetch(CSV_URL)

            if (!res.ok) throw new Error("API Error")

            const csv = await res.text()
            data = parseCSV(csv)

            localStorage.setItem('iplData', JSON.stringify(data))
        }

        displayTeams(data)

    } catch (err) {
        console.error(err)
        document.getElementById('teams-page-container').innerHTML =
            `<p style="color:red;">Error loading teams</p>`
    }
}


function displayTeams(data) {
    const container = document.getElementById('teams-page-container')
    if (!container) return

    const teamStats = {}

    data.forEach(match => {
        const t1 = match.team1
        const t2 = match.team2
        const winner = match.winner

        if (!teamStats[t1]) teamStats[t1] = { matches: 0, wins: 0 }
        if (!teamStats[t2]) teamStats[t2] = { matches: 0, wins: 0 }

        teamStats[t1].matches++
        teamStats[t2].matches++

        if (winner && teamStats[winner]) {
            teamStats[winner].wins++
        }
    })

    const teamsArray = Object.entries(teamStats)

    container.innerHTML = `
        <div class="teams-page-grid">
            ${teamsArray.map(([team, stats]) => `
                <div class="team-page-card">
                    <h3>${team}</h3>
                    <p>Matches: ${stats.matches}</p>
                    <p>Wins: ${stats.wins}</p>
                </div>
            `).join('')}
        </div>
    `
}

loadTeamsPage()


const toggleBtn = document.getElementById("thm-toggle")

if (toggleBtn) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark")
    }

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark")

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark")
        } else {
            localStorage.setItem("theme", "light")
        }
    })
}