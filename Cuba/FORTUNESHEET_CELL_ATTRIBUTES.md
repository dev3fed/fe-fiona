# FortuneSheet Cell Attributes Reference

Panduan dan referensi atribut format sel pada FortuneSheet / Luckysheet beserta pemetaan ke Aspose Cells.

## FortuneSheet Cell Attributes Table

| Attribute | Full Name | Explanation | Example Value | Aspose Method / Property |
| :--- | :--- | :--- | :--- | :--- |
| `ct` | `celltype` | Format tipe nilai sel (text, time, dll) | [Cell format](https://ruilisi.github.io/fortune-sheet-docs/guide/cell.html#cellStyle) | - |
| `bg` | `background` | Warna latar belakang sel | `#fff000` | `setBackgroundColor` |
| `ff` | `fontfamily` | Jenis Font (Font Family) | `0` Times New Roman, `1` Arial, `2` Tahoma, `3` Verdana, `4` Microsoft Yahei, `5` SimSong, `6` ST Heiti, `7` ST Kaiti, `8` ST FangSong, `9` ST Song, `10` Huawen Xingkai, `11` Huawen Lishu | `Style.Font.Name` |
| `fc` | `fontcolor` | Warna font (Font Color) | `#fff000` | `Style.Font.Color` |
| `bl` | `bold` | Ketebalan teks (Bold) | `0` Regular, `1` Bold | `Style.Font.IsBold = true` |
| `it` | `italic` | Kemiringan teks (Italic) | `0` Regular, `1` Italic | `Style.Font.IsItalic` |
| `fs` | `fontsize` | Ukuran font (Font Size) | `14` | `Style.Font.Size` |
| `cl` | `cancelline` | Coretan teks (Strikethrough) | `0` Regular, `1` Cancelline | `Style.Font.IsStrikeout` / `Underline` |
| `vt` | `verticaltype` | Alignment Vertikal | `0` Middle, `1` Up (Top), `2` Down (Bottom) | `setVerticalAlignment` |
| `ht` | `horizontaltype` | Alignment Horizontal | `0` Center, `1` Left, `2` Right | `setHorizontalAlignment` |
| `mc` | `mergecell` | Penggabungan Sel (Merge Cells) | `{ rs: 10, cs: 5 }` *(gabungkan 10 baris & 5 kolom)* | `Merge` |
| `tr` | `textrotate` | Rotasi Teks | `0`: 0°, `1`: 45°, `2`: -45°, `3`: Vertical text, `4`: 90°, `5`: -90° | `setRotationAngle` |
| `tb` | `textbreak` | Mode Pembungkusan Teks (Text Wrap) | `0` Truncation, `1` Overflow, `2` Word Wrap | `2`: `setTextWrapped`, `0 & 1`: `IsTextWrapped = true` |
| `v` | `value` | Nilai asli sel (Original value) | `100`, `"teks"` | - |
| `m` | `monitor` | Nilai tampilan sel (Display value) | `"100"`, `"Rp100.00"` | - |
| `f` | `function` | Formula / Fungsi sel | `"=MAX(A7:A9)"` | `setFormula`, `setArrayFormula`, `workbook.calculateFormula()` |

---

## Contoh Struktur Data JSON Storage Sel

```json
[
  {
    "r": 10,
    "c": 11,
    "v": {
      "f": "=MAX(A7:A9)",
      "ct": { "fa": "General", "t": "n" },
      "v": 100,
      "m": "100"
    }
  },
  {
    "r": 0,
    "c": 1,
    "v": {
      "v": 12,
      "f": "=SUM(A2)",
      "bg": "#fff000"
    }
  },
  {
    "r": 10,
    "c": 11,
    "v": "Nilai 2"
  }
]
```
