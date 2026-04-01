const CSV_URL = "https://raw.githubusercontent.com/ritesh-ojha/IPL-DATASET/main/csv/Match_Info.csv"


function showLoading(id) {
    document.getElementById(id).innerHTML = `
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


async function loadRecords() {
    showLoading('records-container')

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

    displayRecords(data)
}


function displayRecords(data) {
    const container = document.getElementById('records-container')

    
    const wins = {}
    const players = {}
    const venues = {}
    const matchesPlayed = {}

    data.forEach(match => {
        if (match.winner) {
            wins[match.winner] = (wins[match.winner] || 0) + 1
        }

        if (match.player_of_match) {
            players[match.player_of_match] = (players[match.player_of_match] || 0) + 1
        }

        if (match.venue) {
            venues[match.venue] = (venues[match.venue] || 0) + 1
        }

        
        if (match.team1) {
            matchesPlayed[match.team1] = (matchesPlayed[match.team1] || 0) + 1
        }
        if (match.team2) {
            matchesPlayed[match.team2] = (matchesPlayed[match.team2] || 0) + 1
        }
    })

    const topTeam = Object.entries(wins).sort((a,b)=>b[1]-a[1])[0]
    const topPlayer = Object.entries(players).sort((a,b)=>b[1]-a[1])[0]
    const topVenue = Object.entries(venues).sort((a,b)=>b[1]-a[1])[0]
    const mostMatchesTeam = Object.entries(matchesPlayed).sort((a,b)=>b[1]-a[1])[0]

    container.innerHTML = `
        <div class="records-grid">

            <div class="record-card">
                <h3>🏆 Most Wins</h3>
                <h2>${topTeam[0]}</h2>
                <p>${topTeam[1]} Wins</p>
            </div>

            <div class="record-card">
                <h3>⭐ Most Player of Match</h3>
                <h2>${topPlayer[0]}</h2>
                <p>${topPlayer[1]} Awards</p>
            </div>

            <div class="record-card">
                <h3>🏟 Most Matches Venue</h3>
                <h2>${topVenue[0]}</h2>
                <p>${topVenue[1]} Matches</p>
            </div>

            <div class="record-card">
                <h3>📊 Most Matches Played (Team)</h3>
                <h2>${mostMatchesTeam[0]}</h2>
                <p>${mostMatchesTeam[1]} Matches</p>
            </div>

        </div>
    `
}


loadRecords()


const toggleBtn = document.getElementById("thm-toggle")

if (toggleBtn) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark")
    }

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark")

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark") ? "dark" : "light"
        )
    })
}