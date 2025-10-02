import axios from "axios";
import { useState } from "react";
import { postApi } from "./apis";
import type { BarChartData } from "./BarChartCom";
import ChildChart from "./ChildChart";

type ChartData = {
  region: string;
  category: string;
  distname: string;
};

const Charts = () => {
  const [region, setRegion] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [distname, setDistname] = useState<string>("");
  const [chart, setChart] = useState<string>("");
  const [graphdata, setGraphdata] = useState<BarChartData[]>();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === "region") {
      setRegion(value);
    } else if (name === "category") {
      setCategory(value);
    } else if (name === "distname") {
      setDistname(value);
    } else if (name === "chart") {
      setChart(value);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data: ChartData = {
      region: region,
      category: category,
      distname: distname,
    };
    // console.log(data)
    // posting the data
    axios
      .post(postApi, data)
      .then((res) => setGraphdata(res.data.data))
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <form action="" onSubmit={handleSubmit} className="w-full flex justify-center gap-3 mt-2">
        <div>
          <select
            name="region"
            id="region"
            value={region}
            onChange={handleChange}
            className="border"
            required
          >
            <option value="">Select Region</option>
            <option value="SOUTH">South</option>
            <option value="NORTH">North</option>
            <option value="EAST">East</option>
            <option value="WEST">West</option>
          </select>
        </div>
        <div>
          <select
            name="category"
            id="category"
            value={category}
            onChange={handleChange}
            className="border"
            required
          >
            <option value="">Select category</option>
            <option value="R">R</option>
            <option value="D">D</option>
            <option value="O">O</option>
          </select>
        </div>
        <div>
          <select
            name="distname"
            id="distname"
            value={distname}
            onChange={handleChange}
            className="border"
            required
          >
            <option value="">select distname</option>
            <option value="SRI POTTI SRIRAMULU NELLORE">
              SRI POTTI SRIRAMULU NELLORE
            </option>
            <option value="PRAKASAM">PRAKASAM</option>
            <option value="CHITTOOR">CHITTOOR</option>
          </select>
        </div>
        <div>
          <select name="chart" id="chart" value={chart} onChange={handleChange} className="border">
            <option value="">select chart</option>
            <option value="pie">Pie chart</option>
            <option value="bar">Bar chart</option>
            <option value="line">Line chart</option>
          </select>
        </div>
        <div>
          <input type="submit" value="sumbit" className="border" />
        </div>
      </form>
      <div className="w-full flex justify-center items-center mt-1.5">
        <ChildChart graphdata={graphdata ?? []} chart={chart} />
      </div>
    </div>
  );
};
export default Charts;
