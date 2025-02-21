import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-preset-newsletter";
import "grapesjs-blocks-basic";

const EmailBuilder = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = grapesjs.init({
        container: "#gjs",
        height: "700px",
        fromElement: true,
        storageManager: false,
        allowScripts: false,

        plugins: ["gjs-preset-newsletter", "grapesjs-blocks-basic"],

        blockManager: {
          appendTo: "#blocks",
        },

        styleManager: {
          appendTo: "#style-manager",
        },

        panels: {
          defaults: [
            {
              id: "basic-actions",
              el: ".panel__top",
              buttons: [
                {
                  id: "export",
                  className: "btn-export",
                  label: "Export HTML",
                  command: "export-template",
                },
              ],
            },
          ],
        },
      });

      const blockManager = editorRef.current.BlockManager;
      const domComponents = editorRef.current.DomComponents;

      // **Set Initial Email Container**
      editorRef.current.setComponents(`
        <div id="email-container" style="min-height: 500px; padding: 20px; border: 1px dashed #ddd;">
          <p>Start building your email...</p>
        </div>
      `);

      // **Basic Blocks**
      blockManager.add("text", {
        label: "Text",
        category: "Basic",
        content: "<p>Insert your text here...</p>",
      });

      blockManager.add("image", {
        label: "Image",
        category: "Basic",
        content:
          '<img src="https://via.placeholder.com/150" style="width:100%"/>',
      });

      blockManager.add("button", {
        label: "Button",
        category: "Basic",
        content:
          '<button style="padding: 10px 20px; background: #007bff; color: white; border: none;">Click Me</button>',
      });

      // **Section Block**
      blockManager.add("section", {
        label: "Section",
        category: "Layout",
        content: `
          <div data-gjs-droppable="true" style="padding: 20px; border: 1px dashed #ddd; background: #f9f9f9;">
            <p>Drop blocks here...</p>
          </div>
        `,
      });

      // **Column Blocks (Nestable)**
      blockManager.add("2-columns", {
        label: "2 Columns",
        category: "Layout",
        content: `
          <div style="display: flex; gap: 10px;">
            <div data-gjs-droppable="true" style="flex: 1; border: 1px dashed #ddd; padding: 10px;">Column 1</div>
            <div data-gjs-droppable="true" style="flex: 1; border: 1px dashed #ddd; padding: 10px;">Column 2</div>
          </div>
        `,
      });

      blockManager.add("3-columns", {
        label: "3 Columns",
        category: "Layout",
        content: `
          <div style="display: flex; gap: 10px;">
            <div data-gjs-droppable="true" style="flex: 1; border: 1px dashed #ddd; padding: 10px;">Column 1</div>
            <div data-gjs-droppable="true" style="flex: 1; border: 1px dashed #ddd; padding: 10px;">Column 2</div>
            <div data-gjs-droppable="true" style="flex: 1; border: 1px dashed #ddd; padding: 10px;">Column 3</div>
          </div>
        `,
      });

      // **Drag-and-Drop Placeholder Functionality**
      const placeholderSection = document.getElementById("placeholders");
      const editorCanvas = document.getElementById("gjs");

      placeholderSection.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("placeholder-item")) {
          e.dataTransfer.setData("text/plain", e.target.dataset.placeholder);
        }
      });

      editorCanvas.addEventListener("dragover", (e) => {
        e.preventDefault(); // Allow drop
      });

      editorCanvas.addEventListener("drop", (e) => {
        e.preventDefault();
        const placeholder = e.dataTransfer.getData("text/plain");
        const target = e.target;

        if (target && placeholder) {
          const editor = editorRef.current;
          const selected = editor.getSelected();

          if (selected && selected.is("text")) {
            // Insert placeholder into text element
            const cursorPosition = window.getSelection().getRangeAt(0);
            cursorPosition.deleteContents();
            cursorPosition.insertNode(document.createTextNode(placeholder));
          } else if (selected) {
            // Append placeholder to the selected element
            editor.runCommand("core:component-update", {
              component: selected,
              attributes: {
                content: (selected.get("content") || "") + placeholder,
              },
            });
          }
        }
      });
    }
  }, []);

  // **Export Function (Download HTML with Placeholders)**
  const exportHTML = () => {
    if (editorRef.current) {
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss();
      const fullHtml = `<style>${css}</style>${html}`;

      const blob = new Blob([fullHtml], { type: "text/html" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "email-template.html";
      link.click();
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar Blocks Panel */}
      <div
        id="blocks"
        style={{
          width: "250px",
          padding: "10px",
          background: "#f4f4f4",
          borderRight: "1px solid #ddd",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Blocks</h3>
      </div>

      {/* Sidebar Placeholders Panel */}
      <div
        id="placeholders"
        style={{
          width: "200px",
          padding: "10px",
          background: "#f9f9f9",
          borderRight: "1px solid #ddd",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Placeholders</h3>
        <div
          className="placeholder-item"
          data-placeholder="{name}"
          draggable="true"
          style={{
            padding: "10px",
            margin: "5px 0",
            background: "#eee",
            cursor: "grab",
            textAlign: "center",
          }}
        >
          Name
        </div>
        <div
          className="placeholder-item"
          data-placeholder="{email}"
          draggable="true"
          style={{
            padding: "10px",
            margin: "5px 0",
            background: "#eee",
            cursor: "grab",
            textAlign: "center",
          }}
        >
          Email
        </div>
        <div
          className="placeholder-item"
          data-placeholder="{phone}"
          draggable="true"
          style={{
            padding: "10px",
            margin: "5px 0",
            background: "#eee",
            cursor: "grab",
            textAlign: "center",
          }}
        >
          Phone
        </div>
      </div>

      {/* Main Editor Area */}
      <div style={{ flex: 1, padding: "10px" }}>
        <button
          onClick={exportHTML}
          style={{
            marginBottom: "10px",
            padding: "10px",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
          }}
        >
          Export HTML
        </button>

        {/* GrapesJS Editor */}
        <div
          id="gjs"
          style={{ border: "1px solid #ddd", minHeight: "600px" }}
        ></div>
      </div>
    </div>
  );
};

export default EmailBuilder;
