const getJSONBtn = document.getElementById("get-json-btn");

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {
        type: contentType
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function getPalette(stylesArtboard) {

    const palette = {};

    const paletteArtboard = stylesArtboard.filter(item => {
        return item.name === "colors";
    })[0].children;


    paletteArtboard.map(item => {
        function rbaObj(obj) {
            return item.fills[0].color[obj] * 255;
        }

        const colorObj = {
            [item.name]: {
                value: `rgba(${rbaObj("r")}, ${rbaObj("g")}, ${rbaObj("b")}, ${
                    item.fills[0].color.a
                })`,
                type: "color"
            }
        };

        Object.assign(palette, colorObj);
    });

    return palette;
}

async function getStylesArtboard(figmaApiKey, figmaId) {
    const result = await fetch("https://api.figma.com/v1/files/" + figmaId, {
        method: "GET",
        headers: {
            "X-Figma-Token": figmaApiKey
        }
    });
    const figmaTreeStructure = await result.json();

    const stylesArtboard = figmaTreeStructure.document.children.filter(item => {
        return item.name === "styles";
    })[0].children;

    baseTokensJSON = {
        token: {
            colors: {}
        }
    };

    Object.assign(baseTokensJSON.token.colors, getPalette(stylesArtboard));

    download(
        JSON.stringify(baseTokensJSON, null, 1),
        "colors.json",
        "application/json"
    );
}

getJSONBtn.onclick = function () {

    getStylesArtboard(
        "42182-9828e40e-f4fd-4127-90ed-b3c52e4bf982",
        "wBhrKxzQznvWBQekyQe0xd"
    );
    console.log("downloading colors.json");
};