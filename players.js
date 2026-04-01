const CSV_URL = "https://raw.githubusercontent.com/ritesh-ojha/IPL-DATASET/main/csv/Match_Info.csv"


function showLoading(id) {
    const el = document.getElementById(id)
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

        headers.forEach((h, i) => {
            obj[h.trim()] = values[i]?.trim()
        })

        return obj
    })
}


async function loadPlayersPage() {
    showLoading('players-page-container')

    try {
        let data

        const cached = localStorage.getItem('iplData')
        if (cached) {
            data = JSON.parse(cached)
        } else {
            const res = await fetch(CSV_URL)
            const csv = await res.text()
            data = parseCSV(csv)
            localStorage.setItem('iplData', JSON.stringify(data))
        }

        displayPlayers(data)

    } catch (err) {
        console.error(err)
        document.getElementById('players-page-container').innerHTML =
            `<p style="color:red;">Error loading players</p>`
    }
}


function displayPlayers(data) {
    const container = document.getElementById('players-page-container')

    const playerCount = {}

    data.forEach(match => {
        const player = match.player_of_match
        if (player) {
            playerCount[player] = (playerCount[player] || 0) + 1
        }
    })

    const players = Object.entries(playerCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)

    container.innerHTML = `
        <div class="players-page-grid">
            ${players.map(([name, count]) => `
                <div class="player-page-card">
                    <div class="player-avatar">🏏</div>
                    <h3>${name}</h3>
                    <p>${count} Awards</p>
                </div>
            `).join('')}
        </div>
    `
}

loadPlayersPage()


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