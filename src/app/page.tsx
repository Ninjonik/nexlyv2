import React from "react";
import {IndexForm} from "@/app/components/Index/IndexForm";
import {ClientWrapper} from "@/app/ClientWrapper";
import {HomeBase} from "@/app/components/HomeBase";

export default function Home() {

  return (
      <HomeBase>
        <IndexForm/>
      </HomeBase>
  );
}
