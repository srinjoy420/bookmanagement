let booksdata = [];

async function fetchbooks() {
    const url = 'https://api.freeapi.app/api/v1/public/books?page=1&limit=10&inc=kind,id,etag,volumeInfo&query=tech';
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.data.data;
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Function to get books and display them
async function getbooks() {
    const cardcontainer = document.querySelector(".cardcontainer");
    let data = await fetchbooks();

    if (!data) {
        console.log("Error: no books are available");
        return [];
    }

    booksdata = data.map((e) => {
        const volumeinfo = e.volumeInfo || {};
        const authors = volumeinfo.authors?.join(", ") ?? "Info not available";
        const publisher = volumeinfo.publisher ?? "Info not available";
        const publishdate = volumeinfo.publishedDate ?? "Date not available";
        const description = volumeinfo.description ?? "Description not available";
        const title = volumeinfo.title ?? "Title not available";
        const image = volumeinfo.imageLinks?.smallThumbnail ?? "./images/No_Cover.jpg";
        const link = volumeinfo.infoLink ?? "#";

        const linktag = document.createElement("a");
        linktag.href = link;
        linktag.target = "_blank";

        let bookcard = document.createElement("div");
        bookcard.classList.add("card");

        linktag.appendChild(bookcard);

        bookcard.innerHTML = `
        <div class="image">
            <!-- the book image -->
            <img src="${image}" alt="">
        </div>
        <div class="description">
            <!-- the book description -->
            <div class="title">${title}</div>
            <div class="publisher">Publisher: ${publisher}</div>
            <div class="author">Author: ${authors}</div>
            <p class="date">Published at: ${publishdate}</p>
        </div>`;

        cardcontainer.appendChild(linktag);

        return { title, authors, description, publishdate, bookcard };
    });
}

// Function to search books using title or authors
async function searchbooks() {
    const cardcontainer = document.querySelector(".cardcontainer");
    const searchinput = document.getElementById("bookinput")
    searchinput.addEventListener("input", () => {
        const searchvalue = searchinput.value.toLowerCase();
        const filteredbooks = booksdata.filter(book => book.title.toLowerCase().includes(searchvalue) || book.authors.toLowerCase().includes(searchvalue));
        cardcontainer.innerHTML = "" //clear the old books from the screen
        filteredbooks.forEach(book => cardcontainer.appendChild(book.bookcard)); // bookcard means the card where the displayed books
        if (filteredbooks.length === 0) {
            cardcontainer.innerHTML = "<h2>No books found with the given search term</h2>"
        }
    })

}
// short the books by catagory tigger 
async function setupsort() {
    const sortselect = document.getElementById("sortSelect");
    sortselect.addEventListener("change", () => {
        const valuee = sortselect.value;
        if (valuee === "byatoZ") {
            sortbooks("titleASC");
        }
        else if (valuee === "byZtoA") {
            sortbooks("titelDES");
        }
        else if (valuee === "datenew") {
            sortbooks("newpublicdates")
        }
        else if (valuee === "oldtonew") {
            sortbooks("oldestpublicdates")
        }
    })

}
// now sortbooks

async function sortbooks(by = "title") {
    const cardcontainer = document.querySelector(".cardcontainer");
    if (by === "titleASC") {
        booksdata.sort((a, b) => a.title.localeCompare(b.title));
    }
    else if (by === "titelDES") {
        booksdata.sort((a, b) => b.title.localeCompare(a.title));
    }
    else if (by === "newpublicdates") {
        booksdata.sort((a, b) => new Date(a.publishdate) - new Date(b.publishdate))
    }
    else if (by === "oldestpublicdates") {
        booksdata.sort((a, b) => new Date(b.publishdate) - new Date(a.publishdate))
    }
    cardcontainer.innerHTML = "";
    booksdata.forEach(book => cardcontainer.appendChild(book.bookcard))
}
// function for view toggle grid to list
function viewgrid() {
    const cardcontainer = document.querySelector(".cardcontainer");
    const viewbtn = document.getElementById("view-grid");

    viewbtn.addEventListener("click", () => {
        cardcontainer.style.display = "grid";
        cardcontainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))";
        cardcontainer.style.gap = "20px";
        cardcontainer.style.flexDirection = ""; // Reset list view styles if any
        cardcontainer.style.justifyContent = "";
        cardcontainer.style.alignItems = "";
    });
}

function viewlist() {
    const cardcontainer = document.querySelector(".cardcontainer");
    const listbtn = document.getElementById("view-type");

    listbtn.addEventListener("click", () => {
        cardcontainer.style.display = "flex";
        cardcontainer.style.flexDirection = "column";
        cardcontainer.style.justifyContent = "center";
        cardcontainer.style.alignItems = "center";
        cardcontainer.style.gap = "20px";
        cardcontainer.style.gridTemplateColumns = ""; // Clear grid styles if any
    });
}





// Call functions to display books and set up the search functionality
getbooks();
searchbooks();
setupsort();
viewgrid();
viewlist()

