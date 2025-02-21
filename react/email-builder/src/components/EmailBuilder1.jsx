import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-preset-newsletter";
import "grapesjs-blocks-basic";
import "grapesjs-table";
import "grapesjs-style-bg";
import "grapesjs-plugin-forms";
import "grapesjs-plugin-export";
import "grapesjs-plugin-filestack";
import "grapesjs-custom-code";
import "grapesjs-tabs";
import "grapesjs-typed";
import "grapesjs-tooltip";
import "grapesjs-style-filter";
import "grapesjs-touch";

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

        plugins: [
          "gjs-preset-newsletter",
          "grapesjs-blocks-basic",
          "grapesjs-table",
          "grapesjs-style-bg",
          "grapesjs-plugin-forms",
          "grapesjs-plugin-export",
          "grapesjs-plugin-filestack",
          "grapesjs-custom-code",
          "grapesjs-tabs",
          "grapesjs-typed",
          "grapesjs-tooltip",
          "grapesjs-style-filter",
          "grapesjs-touch",
        ],

        pluginsOpts: {
          "gjs-preset-newsletter": {},
          "grapesjs-blocks-basic": {},
          "grapesjs-table": {},
          "grapesjs-style-bg": {},
          "grapesjs-plugin-forms": {},
          "grapesjs-plugin-export": {},
          "grapesjs-plugin-filestack": {
            key: "YOUR_FILESTACK_API_KEY",
          },
          "grapesjs-custom-code": {},
          "grapesjs-tabs": {},
          "grapesjs-typed": {},
          "grapesjs-tooltip": {},
          "grapesjs-style-filter": {},
          "grapesjs-touch": {},
        },

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
                {
                  id: "undo",
                  className: "btn-undo",
                  label: "Undo",
                  command: "core:undo",
                },
                {
                  id: "redo",
                  className: "btn-redo",
                  label: "Redo",
                  command: "core:redo",
                },
              ],
            },
          ],
        },
      });

      const blockManager = editorRef.current.BlockManager;
      const domComponents = editorRef.current.DomComponents;

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

      blockManager.add("table", {
        label: "Table",
        category: "Basic",
        content: `
          <table style="width:100%; border-collapse: collapse;">
            <tr><th>Header 1</th><th>Header 2</th></tr>
            <tr><td>Data 1</td><td>Data 2</td></tr>
          </table>
        `,
      });

      // **Advanced Blocks**
      blockManager.add("social", {
        label: "Social Media",
        category: "Advanced",
        content: `
          <div style="text-align: center;">
            <a href="#" style="margin: 0 5px;"><img src="https://via.placeholder.com/30" alt="Facebook"></a>
            <a href="#" style="margin: 0 5px;"><img src="https://via.placeholder.com/30" alt="Twitter"></a>
            <a href="#" style="margin: 0 5px;"><img src="https://via.placeholder.com/30" alt="Instagram"></a>
          </div>
        `,
      });

      blockManager.add("divider", {
        label: "Divider",
        category: "Advanced",
        content: '<hr style="border-top: 1px solid #ddd;">',
      });

      blockManager.add("spacer", {
        label: "Spacer",
        category: "Advanced",
        content: '<div style="height: 20px;"></div>',
      });

      // **Placeholder Blocks**
      blockManager.add("placeholder-name", {
        label: "Name Placeholder",
        category: "Placeholders",
        content: `<span>{name}</span>`,
        draggable: true,
      });

      blockManager.add("placeholder-email", {
        label: "Email Placeholder",
        category: "Placeholders",
        content: `<span>{email}</span>`,
        draggable: true,
      });

      blockManager.add("placeholder-phone", {
        label: "Phone Placeholder",
        category: "Placeholders",
        content: `<span>{phone}</span>`,
        draggable: true,
      });

      // **Enable Cursor Tracking for Click-to-Insert**
      document.querySelectorAll(".placeholder-btn").forEach((btn) => {
        btn.addEventListener("click", () =>
          insertPlaceholder(btn.dataset.placeholder)
        );
      });
    }
  }, []);

  // **Insert Placeholder at Cursor Position**
  const insertPlaceholder = (placeholder) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selected = editor.getSelected();
    if (selected && selected.is("text")) {
      const cursorPosition = window.getSelection().getRangeAt(0);
      cursorPosition.deleteContents();
      cursorPosition.insertNode(document.createTextNode(placeholder));
    } else {
      editor.runCommand("core:component-update", {
        component: selected,
        attributes: { content: (selected.get("content") || "") + placeholder },
      });
    }
  };

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
        <button
          className="placeholder-btn"
          data-placeholder="{name}"
          onClick={() => insertPlaceholder("{name}")}
          style={{ display: "block", margin: "5px auto", width: "100%" }}
        >
          Insert Name
        </button>
        <button
          className="placeholder-btn"
          data-placeholder="{email}"
          onClick={() => insertPlaceholder("{email}")}
          style={{ display: "block", margin: "5px auto", width: "100%" }}
        >
          Insert Email
        </button>
        <button
          className="placeholder-btn"
          data-placeholder="{phone}"
          onClick={() => insertPlaceholder("{phone}")}
          style={{ display: "block", margin: "5px auto", width: "100%" }}
        >
          Insert Phone
        </button>
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
