"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useRouter } from "next/navigation";
export function Top() {
  const router = useRouter();
  return (
    <ButtonGroup className="[--radius:9999rem]">
      <ButtonGroup>
        <Button asChild variant="outline" size="icon">
          <Link href="/community/home/posts/new">
            <PlusIcon />
          </Link>
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push("/community/home/posts/new");
            }}
            placeholder={"What's on your mind?"}
          />
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  );
}
