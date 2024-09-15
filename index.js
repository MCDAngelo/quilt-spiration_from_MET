import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const port = process.env.PORT || 3000;
const app = express();

const metURL = "https://collectionapi.metmuseum.org/public/collection/v1"
const searchEndpoint = "/search?hasImages=true"

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", async (req, res) => {
    const response = await axios.get(metURL + "/objects/" + "156448");
    res.render("index.ejs", {art: response.data});
})

async function getRandomItem (ids) {
    function removeItem(id, idArray){
        const index = idArray.indexOf(id);
        idArray.splice(index, 1);
        return idArray;
    }
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    try {
        const itemResponse = await axios.get(metURL + "/objects/" + randomId);
        if (itemResponse.data.primaryImage) {
            return itemResponse.data;
        } else {
            console.log(`Item does not have a public image: ${randomId}`)
            const new_ids = removeItem(randomId, ids);
            return getRandomItem(new_ids);
        }
    } catch (error) {
        console.error("Failed to retrieve item", error);
        const new_ids = removeItem(randomId, ids);
        return getRandomItem(new_ids);
    }
}

app.get("/random", async (req, res) => {
    const response = await axios.get(metURL + searchEndpoint + "&q=quilt");
    const objectIds = await response.data.objectIDs;
    const item = await getRandomItem(objectIds);
    res.render("art.ejs", {art: item}); 
})

app.get("/search", async(req, res) => {
    const response = await axios.get(metURL + "/departments");
    const departments = response.data.departments;
    res.render("search.ejs", {departments: departments});
})

app.post("/search", async (req, res) => {
    const department = req.body.department;
    const searchTerm = req.body.searchTerm;
    const url = metURL + searchEndpoint;
    if (department !== "999"){
        const url = metURL + searchEndpoint + `&departmentId=${department}`;
    }
    try {
        const response = await axios.get(url + `&q=${searchTerm}`);
        const objectIds = await response.data.objectIDs;
        if (objectIds.length > 0 ){
            const item = await getRandomItem(objectIds);
            res.render("art.ejs", {art: item}); 
        } else {
            res.status(404);
        }
    } catch (error) {
        res.send(error.status);
    } 
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})