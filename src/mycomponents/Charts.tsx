import axios from "axios";
import { useState } from "react";
import { postApi } from "./apis";
import type { BarChartData } from "./BarChartCom";
import ChildChart from "./ChildChart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";


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

  function handleChange(name:string,value:string) {
    // const { name, value } = e.target;
    
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
    if (!region || !category || !distname || !chart){
      alert('fill reqired fields')
      return
    }
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
          <Select
            name="region"
           
            value={region}
            onValueChange={(value)=>{handleChange('region',value)}}
            
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Region'/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Regions</SelectLabel>
            {/* <SelectItem value="">Select Region</SelectItem> */}
            <SelectItem value="SOUTH">South</SelectItem>
            <SelectItem value="NORTH">North</SelectItem>
            <SelectItem value="EAST">East</SelectItem>
            <SelectItem value="WEST">West</SelectItem>
            </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            name="category"
            
            value={category}
            onValueChange={(value)=>{handleChange('category',value)}}
           
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Select category'/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
            {/* <SelectItem value="">Select category</SelectItem> */}
            <SelectItem value="R">R</SelectItem>
            <SelectItem value="D">D</SelectItem>
            <SelectItem value="O">O</SelectItem>
            </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            name="distname"
            
            value={distname}
            onValueChange={(value)=>{handleChange('distname',value)}}
            
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Select District'/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Districts </SelectLabel>
            {/* <option value="">select distname</option> */}
            <SelectItem value="SRI POTTI SRIRAMULU NELLORE">
              SRI POTTI SRIRAMULU NELLORE
            </SelectItem>
            <SelectItem value="PRAKASAM">PRAKASAM</SelectItem>
            <SelectItem value="CHITTOOR">CHITTOOR</SelectItem>
            </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select name="chart"  value={chart} onValueChange={(value)=>{handleChange('chart',value)}} >
            <SelectTrigger>
              <SelectValue placeholder='Select chart'/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Charts </SelectLabel>
            {/* <SelectItem value="">select chart</SelectItem> */}
            <SelectItem value="pie">Pie chart</SelectItem>
            <SelectItem value="bar">Bar chart</SelectItem>
            <SelectItem value="line">Line chart</SelectItem>
            </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          {/* <input type="submit" value="sumbit" className="border" /> */}
          <Button >Submit</Button>
        </div>
      </form>
      <div className="w-full flex justify-center items-center mt-1.5">
        <ChildChart graphdata={graphdata ?? []} chart={chart} />
      </div>
    </div>
  );
};
export default Charts;
