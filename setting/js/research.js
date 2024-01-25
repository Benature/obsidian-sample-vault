class Research {
  FOLDER = "文献笔记";

  title(p) {
    let title = `[[${p.file.name}|${p.title}]]`;
    if (p.aliases) {
      for (let alias of p.aliases) {
        if (p.title.indexOf(alias) >= 0) {
          let t = `[[` + p.file.name + `|` + alias + `]]`;
          title = p.title.replace(alias, t);
          break;
        }
      }
    } else if (p.alias) {
      let alias;
      if (p.alias.constructor == String && p.alias.startsWith("@")) {
        alias = p.file.name;
      } else {
        alias = p.alias;
      }
      if (p.title.indexOf(alias) >= 0) {
        title = p.title.replace(alias, `[[${p.file.name}|${alias}]]`);
      } else {
        title = `[[${p.file.name}|${alias}]] *|* ${p.title}`;
      }
    }
    let CCF = this.CCF(p);
    if (CCF.length > 0) {
      CCF = CCF + " ";
    }
    return CCF + title;
  }
  CCF(p) {
    const color = { A: "#e05252", B: "orange", C: "green" };
    const CCF_level_index = 1;

    const CCF_index = p.file.etags
      .map(t => String(t).indexOf("CCF/") >= 0)
      .indexOf(true);
    let CCF = "";
    if (CCF_index >= 0) {
      CCF = String(p.file.etags[CCF_index]).split("/")[CCF_level_index];
      CCF = `<a style="color: ${color[CCF]}" href="#A/CCF/${CCF}">[${CCF}]</a>`;
    }
    return CCF;
  }
  year(y) {
    let maxY = 2024;
    let minY = 2015;
    let min_alpha = 0.4;
    let style = "";
    if (y <= minY) {
      style = `style="color: rgba(255,255,255,${
        min_alpha - 0.1
      }); font-style: italic;"`;
    } else {
      let alpha =
        (1 - (maxY - y) / (maxY - minY)) * (1 - min_alpha) + min_alpha;
      style = `style="color: rgba(255,255,255,${alpha});"`;
    }
    if (y >= 2000) {
      y -= 2000;
    } else {
      y -= 1900;
    }
    if (y < 10) {
      y = `0${y}`;
    }
    return `<span ${style}>${y}\'</span>`;
  }
  file_size(p) {
    let size = p.file.size / 1024;
    let style = "";
    if (size < 2) {
      style = `style="color:gray; font-style: italic;"`;
    }
    return `<span ${style}>${size.toFixed(1)}</span>`;
  }

  d2s(t, dateformat = undefined, offset = undefined) {
    dateformat ||= "YYYY.MM.DD";
    offset = offset === undefined ? 2 : offset;
    return window
      .moment(t.toString())
      .format(dateformat.slice(offset, dateformat.length));
  }
  /* render M/C*/
  render_MC(p, dateformat = undefined, offset = undefined) {
    let style = "font-family:var(--font-monospace);";
    return (
      `<div><span style="${style}">M: ${this.d2s(
        p.file.mtime,
        dateformat,
        offset
      )}</span></div>` +
      `` +
      `<div><span style="color:var(--tag-color);${style}">C: ${this.d2s(
        p.file.ctime,
        dateformat,
        offset
      )}</span></div>`
    );
  }

  author(dv) {
    var books = dv.pages(`#书 and [[]]`).sort(p => p.file.mday, "desc");
    dv.table(
      [`书名`, "tags", "出版时间", "KB", "M/C"],
      books.map(p => [
        p.file.link,
        p.file.tags.filter(t => !(t == "#书" || t.startsWith("#书/"))),
        p.publishTime
          ? window.moment(p.publishTime.toString()).format("YYYY-MM-DD")
          : "",
        this.file_size(p),
        this.render_MC(p, "YYYY-MM-DD", 0),
      ])
    );
  }

  researcher(dv) {
    var papers = dv
      .pages(`"${this.FOLDER}" and [[]]`)
      .sort(p => p.year, "desc");

    dv.el("p", "");
    this.render_table(dv, papers);

    // dv.el(
    //   `div`,
    //   `<div style="display: block; position: relative; width: 100%; height: 0px; --aspect-ratio:${ratio}; padding-bottom: calc(var(--aspect-ratio) * 100%);"><iframe src="https://www.youtube.com/embed/${id}" allow="fullscreen" style="position: absolute; top: 0px; left: 0px; height: 100%; width: 100%;"></iframe></div>`
    // );
    let url = dv.current().scholar;
    if (url) {
      dv.el("p", "");
      dv.el("iframe", "scholar", {
        attr: {
          width: "100%",
          height: "700",
          src: url,
          frameborders: "0",
        },
      });
    }
  }

  topic(dv, query = "") {
    var papers = dv
      .pages(`"${this.FOLDER}" and [[${query}]] and -#graph-ignore`)
      .sort(p => p.file.mtime, "desc");
    this.render_table(dv, papers);
  }

  render_table(dv, papers) {
    dv.table(
      [`Paper`, "年", "Related", "KB", "M/C"],
      papers.map(p => [
        this.title(p),
        this.year(p.year),
        p.related,
        // p.area,
        this.file_size(p),
        // this.d2s(p.file.mtime) + `\n` + this.d2s(p.file.ctime),
        this.render_MC(p),
      ])
    );
  }
}
