## QUILT-SPIRATION

Quilt-spiration was created as part of a web development bootcamp to learn how to build a dynamic website using node.js and express.

The website leverages the public API provided by the Metropolitan Museum of New York, to inspire quilters. The website has two main functionalities: 
1. **Random**, which serves a randomly selected item from the MET collection using the keyword `quilt`.
2. **Search**, which allows users to search for items using a keyword and/or by department. A randomly selected item is shown based on the search parameters.

Note, not all items in the MET collections have publically available images. The website only returns items that have images available for display.

The website is available live at https://quilt-spiration-from-met.onrender.com/ 

## Usage

To build the website locally, first install the necessary packages:

```
npm i
```

then run the app using:

```
nodemon index.js
```


## Future Work

* Better error handling for the search route
* Addition of search terms pertaining to the medium of the item
