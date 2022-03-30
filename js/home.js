var index_slide = 0;
let slides = [
    {
        banner: `${window.location.origin}/storage/image/youtube_home.png`,
        classTag: "banner image-wrapper",
        type: "youtube",
        content: {
            text: "Easily get videos from YouTube, then download without having to watch ads.",
            button: {
                class: "youtube btn-content",
                content: "SEARCH YOUTUBE VIDEOS"
            }
        }
    },
    {
        banner: `${window.location.origin}/storage/image/soundcloud_home.png`,
        classTag: "banner image-wrapper",
        type: "soundcloud",
        content: {
            text: "Easily get tracks from Soundcloud, then download without having to watch ads.",
            button: {
                class: "soundcloud btn-content",
                content: "SEARCH SOUNDCLOUD TRACK"
            }
        }
    },
    {
        banner: `${window.location.origin}/storage/image/spotify_home.png`,
        classTag: "banner image-wrapper",
        type: "spotify",
        content: {
            text: "Easily get tracks from Spotify, then download without having to watch ads",
            button: {
                class: "spotify btn-content",
                content: "SEARCH SPOTIFY TRACK"
            }
        }
    }
];

const slider = document.getElementById("slider");
let arrow = {
    left: document.querySelector(".arrow-left"),
    right: document.querySelector(".arrow-right")
}

arrow.left.addEventListener("click", arrow_left);
arrow.right.addEventListener("click", arrow_right);

function arrow_left() {
    if(index_slide == 0) {
        index_slide = (slides.length - 1);
    } else {
        index_slide -= 1;
    }
    tl.fromTo(".slider-content", { x: 0, opacity: 1 }, { x: -200, opacity: 0 });

    setTimeout(() => {
        const oldBanner = document.querySelector(".image-wrapper");
        if(oldBanner) oldBanner.remove();

        const content = document.getElementById("content");
        if(content) content.remove();

        let slide = slides[index_slide];
        const image_wrapper = document.createElement("div");
        image_wrapper.setAttribute("class", "image-wrapper");

        const banner = document.createElement("img");
        banner.setAttribute("src", slide.banner);
        banner.setAttribute("class", slide.classTag);
        banner.setAttribute("id", "banner");

        image_wrapper.appendChild(banner)
        slider.appendChild(image_wrapper);

        if(slide.type.toLowerCase() !== "home") {
            let content = document.createElement("div");
            content.setAttribute("class", "content");
            content.setAttribute("id", "content");

            const p = document.createElement("p");
            p.textContent = slide.content.text;
            content.appendChild(p);

            const button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("class", slide.content.button.class);
            button.setAttribute("onclick", `page_direct('${slide.type}')`);
            button.textContent = slide.content.button.content;

            content.appendChild(button);
            slider.appendChild(content);
        }
        
        tl.fromTo(".slider-content", { x: 200, opacity: 0 }, { x: 0, opacity: 1 });
    }, 750);
}

function arrow_right() {
    if(index_slide == (slides.length - 1)) {
        index_slide = 0
    } else {
        index_slide += 1;
    }
    tl.fromTo(".slider-content", { x: 0, opacity: 1 }, { x: 200, opacity: 0 });

    setTimeout(() => {
        const oldBanner = document.querySelector(".image-wrapper");
        if(oldBanner) oldBanner.remove();

        const content = document.getElementById("content");
        if(content) content.remove();

        let slide = slides[index_slide];
        const image_wrapper = document.createElement("div");
        image_wrapper.setAttribute("class", "image-wrapper");

        const banner = document.createElement("img");
        banner.setAttribute("src", slide.banner);
        banner.setAttribute("class", slide.classTag);
        banner.setAttribute("id", "banner");

        image_wrapper.appendChild(banner)
        slider.appendChild(image_wrapper);

        if(slide.type.toLowerCase() !== "home") {
            let content = document.createElement("div");
            content.setAttribute("class", "content");
            content.setAttribute("id", "content");

            const p = document.createElement("p");
            p.textContent = slide.content.text;
            content.appendChild(p);

            const button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("class", slide.content.button.class);
            button.setAttribute("onclick", `page_direct('${slide.type}')`);
            button.textContent = slide.content.button.content;

            content.appendChild(button);
            slider.appendChild(content);
        }
        
        tl.fromTo(".slider-content", { x: -200, opacity: 0 }, { x: 0, opacity: 1 });
    }, 750);
}

function page_direct(page) {
    window.location = `/${page}`;
}