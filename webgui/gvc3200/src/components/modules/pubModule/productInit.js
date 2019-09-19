import * as Store from '../../entry'

export const productInit = () => {
    let states = Store.store.getState();
    let oem = states.oemId;
    let product = states.product;
    let productStr = states.productStr;
    if (oem != '0') {
    } else {
        let link = document.createElement('link');
        link.rel="shortcut icon";
        link.href = "/img/favicon.ico";
        link.type = "image/x-icon"
        document.querySelector("head").appendChild(link);
    }
    document.title = productStr != "" && productStr != undefined ? productStr : "";
}
