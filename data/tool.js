const fs = require('fs')

const json = JSON.parse(fs.readFileSync('./products.json','utf-8'))


json.forEach(element => {
    //console.log(  typeof(element.sale));
    str = element.sale
    if(element.sale){
        var newValue = parseFloat(str.replace("%","")) /100
        element.sale = newValue
        console.log("newValue",typeof(element.sale))
    }

});

var jsonf = JSON.stringify(json);
fs.writeFileSync('newProducts.json', jsonf, 'utf-8');