import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { barGraphApi } from "./apis";

export interface ChartData {
  comname: string;
  total_sum: number;
  netweight_sum: number;
}

const BarChartCom: React.FC = () => {
  const [details, setDetails] = useState<ChartData[]>([]);

  // Fetch API data
  useEffect(() => {
    axios
      .get(barGraphApi)
      .then((res) => setDetails(res.data.data))
      .catch((err) => console.error(err));
  }, []);
  console.log(details);

  useLayoutEffect(() => {
    if (details.length === 0) return;

    let root = am5.Root.new("barChartDiv");

    root.setThemes([am5themes_Animated.new(root)]);
    //for removing logo
    root._logo?.dispose();
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        pinchZoomX: false,
        // paddingLeft: 0,
        // paddingRight: 1,
      })
    );

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true,
    });
    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15,
    });
    xRenderer.grid.template.setAll({ location: 1 });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "comname",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis.children.push(
      am5.Label.new(root, {
        text: "Company Name",
        fontSize: 14,
        x: am5.p50,
        centerX: am5.p50,
        paddingTop: 10,
      })
    );

    let yRenderer = am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1});
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, { renderer: yRenderer })
    );

    yAxis.children.unshift(
      am5.Label.new(root, {
        text: "Net Weight Sum",
        fontSize: 14,
        rotation: 90,
        centerY: am5.p50,
        paddingTop: 10,
      })
    );

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Netweight Sum",
        xAxis,
        yAxis,
        valueYField: "netweight_sum",
        categoryXField: "comname",
        tooltip: am5.Tooltip.new(root, { labelText: "{categoryX}: {valueY}" }),
      })
    );

    series.columns.template.setAll({
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      strokeOpacity: 0,
    });

    series.columns.template.adapters.add("fill", (_, target) => {
      return chart.get("colors")!.getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", (_, target) => {
      return chart.get("colors")!.getIndex(series.columns.indexOf(target));
    });

    series.bullets.push(() =>
      am5.Bullet.new(root, {
        locationY: 1,
        sprite: am5.Label.new(root, {
          text: "{valueY}",
          centerX: am5.p50,
          centerY: am5.p0,
          populateText: true,
          fontSize: 12,
          fill: am5.color(0x000000),
        }),
      })
    );

    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        centerY: am5.p50,
        y: am5.p100,
        paddingTop: 10,
      })
    );

    legend.data.setAll(chart.series.values);

    xAxis.data.setAll(details);
    series.data.setAll(details);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [details]);

  return <div id="barChartDiv" style={{ width: "50%", height: "350px" }}></div>;
};

export default BarChartCom;
