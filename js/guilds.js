const connections = document.querySelectorAll(".connection");
for (let i = 0; i < connections.length; i++) {
    const connection = connections[i];
    connection.addEventListener("click", () => {
        let data = {
            guild_id: connection.value
        }
        fetch("/api/session/guilds", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if(!res.guild) window.location = `/login/connection/discord/invite?guild_id=${connection.value}`;
            else window.location = `/login/connection/discord/invite/disconnect?guild_id=${connection.value}`;
        });
    });
}

const servers = document.querySelectorAll(".server");
if(servers) {
    for (let i = 0; i < servers.length; i++) {
        const server = servers[i];
        server.addEventListener("click", () => {
            window.location = `/me/servers/${server.id}`;
        });
    }
}

document.querySelectorAll(".icon").forEach(element => {
    fetch("/api/session/guilds", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: element.id })
    })
    .then(res => res.json())
    .then(res => {

        if(res.guild) {

            let avatar = res.guild.icon ? `https://cdn.discordapp.com/icons/${res.guild.id}/${res.guild.icon}.webp` : "/storage/image/Discord-Logo-White_1.svg";
            element.src = avatar;

        } else {

            if(element.classList[1] === undefined) {

                element.src = "/storage/image/Discord-Logo-White_1.svg";

            } else {

                let avatar = `https://cdn.discordapp.com/icons/${element.id}/${element.classList[1]}.webp?size=1024`;
                element.src = avatar;

            }

        }

    })
});