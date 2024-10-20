import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React from "react";

export default function GhostText(props: any) {
  return (
    <NodeViewWrapper as="span">
      <NodeViewContent className="!inline select-none text-gray-300" as="span">
        {props.node.attrs.content}
      </NodeViewContent>
    </NodeViewWrapper>
  );
}
