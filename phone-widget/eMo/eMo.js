window.eMo_clothingShop = function(shop) {
    $("#eMo-body").empty();
    $("#eMo-body").append(wikifier("eMoTabs"));
    $("#eMo-body").append(wikifier("eMo_clothingShopV2_countPage", shop));
    $("#eMo-body").append('<div class="eMoWaterfall" id="waterfallbody"></div>');
    $("#waterfallbody").append(wikifier("eMo_getClothingItems"));
    $("#waterfallbody").append(wikifier("eMo_clothingPageGenerate", 0));
    if (shop == "eMo_clothing") {
        $("#eMoTabButton1").addClass("active");
    } else {
        $("#eMoTabButton2").addClass("active");
    }
    $(".eMo-container")[0].addEventListener("scroll", function() {
        if ($(".eMo-container")[0].scrollTop + $(".eMo-container")[0].clientHeight >= $(".eMo-container")[0].scrollHeight - 10) {
            if (V.shopPage + 1 <= T.maxPage) {
                $("#waterfallbody").append(wikifier("eMo_clothingPageGenerate", V.shopPage + 1));
                V.shopPage++;
            }
        }
    });
}