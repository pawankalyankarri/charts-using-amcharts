import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect } from "react";
import * as am5percent from "@amcharts/amcharts5/percent";

export interface BarChartData {
  comname: string;
  total_sum: number;
  netweight_tmt_sum: number;
}

interface ChildChartProps {
  graphdata: BarChartData[];
  chart: string;
}

const ChildChart = ({ graphdata, chart }: ChildChartProps) => {
  console.log(graphdata);
  useLayoutEffect(() => {
    if (graphdata.length === 0) return;

    let root = am5.Root.new("chartDiv");
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    if (chart === "bar") {
      //  Bar Chart
      let barChart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          paddingLeft: 0,
          paddingRight: 1,
          paddingBottom : 40,
        })
      );

      let cursor = barChart.set("cursor", am5xy.XYCursor.new(root, {}));
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

      let xAxis = barChart.xAxes.push(
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

      let yAxis = barChart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {
            minGridDistance: 50,
          }),
        })
      );
      //label
      yAxis.children.unshift(
        am5.Label.new(root, {
          text: "Net Weight Sum",
          fontSize: 14,
          rotation: -90,
          y: am5.p50,
          centerX: am5.p50, // to place the y-axis label in the center
          paddingBottom: 0,
        })
      );

      let series = barChart.series.push(
        am5xy.ColumnSeries.new(root, {
          xAxis,
          yAxis,
          valueYField: "netweight_tmt_sum",
          categoryXField: "comname",
          tooltip: am5.Tooltip.new(root, {
            labelText: "{categoryX}: {valueY}",
          }),
        })
      );

      series.columns.template.adapters.add("fill", (_, target) => {
        return barChart.get("colors")!.getIndex(series.columns.indexOf(target));
      });

      series.columns.template.adapters.add("stroke", (_, target) => {
        return barChart.get("colors")!.getIndex(series.columns.indexOf(target));
      });

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          locationY: 1,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            centerX: am5.p50,
            centerY: am5.p100,
            populateText: true,
            fontSize: 12,
            fill: am5.color(0x000000),
          }),
        })
      );

      xAxis.data.setAll(graphdata);
      series.data.setAll(graphdata);

      // const legend = barChart.children.unshift(
      //   am5.Legend.new(root, {
      //     centerX: am5.percent(50),
      //     x: am5.percent(50),
      //     // centerY: am5.p50,
      //     // y: am5.p100,

      //     layout: root.horizontalLayout,
      //     paddingTop: 10,
      //     visible: true,
      //   })
      // );

      // legend.data.setAll(series.dataItems);
      // console.log(series.data.values)
      //legend.data.setAll(barChart.series.values)

      // Custom legend container

      // console.log(series.dataItems)

      const legendContainer = barChart.children.unshift(
        am5.Container.new(root, {
          x: am5.p50,
          centerX: am5.p50,
          y: am5.percent(100), // bottom of chart container
          centerY: am5.p0, // align properly
          layout: root.horizontalLayout,
        })
      );

      // Loop over categories to create legend items
      series.dataItems.forEach((dataItem, index) => {
        const color = barChart.get("colors")!.getIndex(index);

        const legendItem = legendContainer.children.push(
          am5.Container.new(root, {
            layout: root.horizontalLayout,
            paddingRight: 10,
          })
        );

        // Color box
        legendItem.children.unshift(
          am5.Rectangle.new(root, { width: 15, height: 15, fill: color })
        );

        // Category name label
        legendItem.children.unshift(
          am5.Label.new(root, {
            text: dataItem.get("categoryX"),
            fontSize: 12,
            centerY: am5.p50,
            paddingLeft: 5,
            height : 20
          })
        );
      });

      series.appear(1000);
      barChart.appear(1000, 100);
    } else if (chart === "pie") {
      //  Pie Chart
      let pieChart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
        })
      );

      let pieSeries = pieChart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "netweight_tmt_sum",
          categoryField: "comname",
        })
      );

      pieSeries.data.setAll(graphdata);

      let legend = pieChart.children.push(
        am5.Legend.new(root, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          marginTop: 15,
          marginBottom: 15,
        })
      );

      legend.data.setAll(pieSeries.dataItems);

      pieSeries.appear(1000, 100);
    } else if (chart === "line") {
      // line chart
      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX: true,
        })
      );

      chart.set(
        "scrollbarX",
        am5.Scrollbar.new(root, {
          orientation: "horizontal",
        })
      );

      let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 60 });
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

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
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

      let cursor = chart.set(
        "cursor",
        am5xy.XYCursor.new(root, { behavior: "none", xAxis })
      );
      cursor.lineY.set("visible", false);

      let series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "Netweight Sum",
          xAxis,
          yAxis,
          valueYField: "netweight_tmt_sum",
          categoryXField: "comname",
          locationX: 0.5,
          stroke: am5.color(0xc83830),
          fill: am5.color(0xc83830),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{categoryX}: {valueY}",
          }),
        })
      );

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 6,
            fill: series.get("fill"),
            stroke: root.interfaceColors.get("background"),
            strokeWidth: 2,
          }),
          locationX: 0.5,
        })
      );

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            populateText: true,
            centerX: am5.p50,
            centerY: -10,
            fontSize: 12,
            fontWeight: "bold",
            fill: series.get("fill"),
          }),
          locationX: 0.5,
        })
      );

      series.data.setAll(graphdata);
      xAxis.data.setAll(graphdata);

      series.appear(1000);
      chart.appear(1000, 100);
    }

    return () => {
      root.dispose();
    };
  }, [graphdata, chart]);

  return <div id="chartDiv" style={{ width: "60%", height: "350px" }}></div>;
};

export default ChildChart;
