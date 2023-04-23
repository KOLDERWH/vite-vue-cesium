import {
    Cartesian3,
    JulianDate,
    Math,
    PathGraphics,
    SampledPositionProperty,
    TimeInterval,
    TimeIntervalCollection,
    VelocityOrientationProperty,
    Viewer
} from "cesium";

class ModelFly {

    public static startFly = function (viewer: Viewer) {
        const flightData = JSON.parse(
            `[{"longitude":109.007858,"latitude":34.195278,"height":34.27},
            {"longitude":109.008165,"latitude":34.194873,"height":43.37},
            { "longitude": 109.008099, "latitude": 34.19467, "height":40 },
            { "longitude": 109.008177, "latitude": 34.194022, "height":42 },
            { "longitude": 109.008008, "latitude": 34.19345, "height":47.79 },
            { "longitude": 109.008502, "latitude": 34.193273, "height":40.88 },
            { "longitude": 109.008681, "latitude": 34.194156, "height":47.18 },
            { "longitude": 109.008847, "latitude": 34.193644, "height":47.27 },
            { "longitude": 109.008723, "latitude": 34.192215, "height":41.94 },
            { "longitude": 109.008297, "latitude": 34.191897, "height":42.01 },
            { "longitude": 109.008359, "latitude": 34.191375, "height":49.78 },
            { "longitude": 109.008382, "latitude": 34.190683, "height":47.13 },
            { "longitude": 109.007282, "latitude": 34.190698, "height":49.97 },
            { "longitude": 109.006662, "latitude": 34.19078, "height":44.31 },
            { "longitude": 109.005938, "latitude": 34.190837, "height":43.38 },
            { "longitude": 109.004075, "latitude": 34.190988, "height":42 },
            { "longitude": 109.003149, "latitude": 34.19032, "height":45.23 },
            { "longitude": 109.003171, "latitude": 34.191639, "height":46.3 },
            { "longitude": 109.003529, "latitude": 34.192086, "height":42.32 },
            { "longitude": 109.00471, "latitude": 34.192608, "height":42.01 },
            { "longitude": 109.004375, "latitude": 34.192886, "height":42 },
            { "longitude": 109.003992, "latitude": 34.193363, "height":48.62 },
            { "longitude": 109.004055, "latitude": 34.194202, "height":43.1 },
            { "longitude": 109.00452, "latitude": 34.19508, "height":46.85 },
            { "longitude": 109.005263, "latitude": 34.194747, "height":46.02 },
            { "longitude": 109.005804, "latitude": 34.194941, "height":42.95 },
            { "longitude": 109.005705, "latitude": 34.195136, "height":44.84 },
            { "longitude": 109.006321, "latitude": 34.19529, "height":44.92 },
            { "longitude": 109.00691, "latitude": 34.195091, "height":47.1 },
            { "longitude": 109.007344, "latitude": 34.195366, "height":43 },
            { "longitude": 109.008088, "latitude": 34.195209, "height":40 },
            { "longitude": 109.008121, "latitude": 34.194724, "height":28.3 }]`
        );

        const timeStepInSeconds = 10;
        const totalSeconds = timeStepInSeconds * (flightData.length - 1);
        const start = JulianDate.fromIso8601("2022-02-20T23:10:00Z");
        const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.timeline.zoomTo(start, stop);
        //Speeduptheplaybackspeed50x.
        viewer.clock.multiplier = 3;
        //Startplayingthescene.
        viewer.clock.shouldAnimate = true;



        const positionProperty = new SampledPositionProperty();

        // const arrs: Cartesian3[] = [];


        for (let i = 0; i < flightData.length; i++) {
            const dataPoint = flightData[i];

            const time = JulianDate.addSeconds(start, i * timeStepInSeconds, new JulianDate());
            const position = Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
            positionProperty.addSample(time, position);
            positionProperty

            // console.log(position);
            // arrs.push(position)
            // viewer.entities.add({
            //     description: `Location:(${dataPoint.longitude},${dataPoint.latitude},${dataPoint.height})`,
            //     position: position,
            //     point: { pixelSize: 10, color: Color.RED }
            // });
        }


        const airplaneUri = 'models/Cesium_Air.glb';
        const airplaneEntity = viewer.entities.add({
            name: "plane",
            availability: new TimeIntervalCollection([new TimeInterval({ start: start, stop: stop })]),
            position: positionProperty,
            model: {
                uri: airplaneUri,
                scale: 0.1,
            },
            // Automatically compute the orientation from the position.
            orientation: new VelocityOrientationProperty(positionProperty),
            path: new PathGraphics({ width: 2 }),
            description: `the plane model`
        });
        // ModelFly.flyTo(viewer);
        viewer.trackedEntity = airplaneEntity;
    }

    // 定位到目标地点
    public static flyTo = function (viewer: Viewer,
        destination = { lon: 109.008411, lat: 34.19217, height: 90 },
        // orientation = { heading: 0, pitch: Math.toRadians(100), roll: 0.0 }
    ) {
        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(
                destination.lon,
                destination.lat,
                destination.height
            ),
            orientation: {
                // heading: cesiumStore.viewer.camera.heading,
                heading: 0,
                pitch: -Math.PI_OVER_TWO + 0.9,
                // pitch: Math.toRadians(100),
                roll: 0,
            },
        });
    }

}
export default ModelFly