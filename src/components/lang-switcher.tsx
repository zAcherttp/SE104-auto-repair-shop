"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from "@/src/components/ui/drawer";
import React from "react";
import { CheckIcon, ChevronDownIcon, GlobeIcon, XIcon } from "lucide-react";

export default function Component() {
  return (
    <React.Fragment>
      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <GlobeIcon className="h-5 w-5" />
              <span>EN</span>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="flex items-center justify-between">
              <span>English</span>
              <CheckIcon className="h-5 w-5" />
            </DropdownMenuItem>
            <DropdownMenuItem>Español</DropdownMenuItem>
            <DropdownMenuItem>Français</DropdownMenuItem>
            <DropdownMenuItem>Deutsch</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <GlobeIcon className="h-5 w-5" />
            <span>EN</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="grid gap-4 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Language</h3>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <XIcon className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
            <div className="grid gap-2">
              <Button variant="ghost" className="justify-start gap-2">
                <GlobeIcon className="h-5 w-5" />
                <span>English</span>
                <CheckIcon className="h-5 w-5 ml-auto" />
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <GlobeIcon className="h-5 w-5" />
                <span>Español</span>
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <GlobeIcon className="h-5 w-5" />
                <span>Français</span>
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <GlobeIcon className="h-5 w-5" />
                <span>Deutsch</span>
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
}
