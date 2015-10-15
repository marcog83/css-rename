/**
 * Created by mgobbi on 15/10/2015.
 */
require.config(
    {
        paths: {
            cssr: "../../dist/css-rename"
        }
    }
);
require(["./map", "cssr"], function (map, cssr) {
    cssr.CLASSES_MAP=map;
    var nodes = cssr.dom.querySelectorAll(".content-CTR > .content-CNT", document.body);
    console.log(nodes);
    var query = cssr.dom.getCssName(".content-CTR > .content-CNT");
    console.log(query)
});