﻿var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Vimeo',
    version:'0.1',
    prepareImgLinks:function (callback) {
        var res = [];
        hoverZoom.urlReplace(res,
            'img[src*="/ps/"]',
            /_\d+\./,
            '_300.'
        );
        hoverZoom.urlReplace(res,
            'img[src*="/ts/"]',
            /_\d+\./,
            '_640.'
        );
        callback($(res));
    }
});
