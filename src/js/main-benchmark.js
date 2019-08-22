
ORDER = 8;
CURVE = Math.pow(2, ORDER);
suite("scurve", function() {
    bench("hilbert_index", function() {
        for (var x = 0; x < CURVE; x++)
            for (var y = 0; y < CURVE; y++)
                scurve.hilbert_index(ORDER, x, y);
    });
    bench("hilbert_point", function() {
        for (var x = 0; x < (CURVE*CURVE); x++)
            scurve.hilbert_point(ORDER, x);
    });
});
suite("creeper",
    function() {
        points = 256 * 1024;
        model = new binvis._File({
            name: "test",
            data: new ArrayBuffer(points)
        });
        filecreeperview = new binvis._FileCreeperView({
            model: model
        });
        filecreeperview.setElement($(".crawlercanvas"));



        function creeper_clear_cycle(curvename) {
            return function(){
                model.set(
                    {
                        "creeper": new Extent(0, points),
                        "curvename": curvename
                    }
                );
                filecreeperview.render();
                filecreeperview.clear();
            };
        }

        function creeper_crawl(curvename){
            return function() {
                for (var i = 0; i < 200; i++){
                    model.set(
                        {
                            "creeper": new Extent(i*10, i*10 + 320),
                            "curvename": curvename
                        }
                    );
                }
            };
        }

        bench("creeper-clear-cycle-hilbert", creeper_clear_cycle("hilbert"));
        bench("creeper-clear-cycle-line", creeper_clear_cycle("line"));
        bench("creeper-crawl-hilbert", creeper_crawl("hilbert"));
        bench("creeper-crawl-line", creeper_crawl("line"));
    }
);
