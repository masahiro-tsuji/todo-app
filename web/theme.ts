import { createTheme, type PaletteColor, type PaletteColorOptions } from '@mui/material';
import { blue, cyan, green, grey, red, yellow } from '@mui/material/colors';
import type React from 'react';

const DEFAULT_FONT_SIZE = 14;

/** カラータイプの定義 */
type ColorType = {
  /** 明るい色調 */
  light: string;
  /** メインカラー */
  main: string;
  /** 暗い色調 */
  dark: string;
};

/** Material-UIのテーマ拡張定義 */
declare module '@mui/material/styles' {
  /** テーマの型定義 */
  interface Theme {
    /** 青色の定義 */
    blue: ColorType;
    /** シアン色の定義 */
    cyan: ColorType;
    /** 緑色の定義 */
    green: ColorType;
    /** グレー色の定義 */
    grey: ColorType;
    /** 必須項目の色 */
    required: string;
  }

  /** テーマオプションの型定義 */
  interface ThemeOptions {
    /** 青色の定義 */
    blue: ColorType;
    /** シアン色の定義 */
    cyan: ColorType;
    /** 緑色の定義 */
    green: ColorType;
    /** グレー色の定義 */
    grey: ColorType;
    /** 必須項目の色 */
    required: string;
  }

  /** タイポグラフィバリアントの型定義 */
  interface TypographyVariants {
    /** エラーメッセージ用のスタイル */
    error: React.CSSProperties;
    /** 警告メッセージ用のスタイル */
    warning: React.CSSProperties;
  }

  /** タイポグラフィバリアントオプションの型定義 */
  interface TypographyVariantsOptions {
    /** エラーメッセージ用のスタイル */
    error: React.CSSProperties;
    /** 警告メッセージ用のスタイル */
    warning: React.CSSProperties;
  }

  /** パレットの型定義 */
  interface Palette {
    /** カスタムグレー色の定義 */
    customGray: PaletteColor;
  }

  /** パレットオプションの型定義 */
  interface PaletteOptions {
    /** カスタムグレー色の定義 */
    customGray?: PaletteColorOptions;
  }
}

/** Typographyコンポーネントのバリアント拡張定義 */
declare module '@mui/material/Typography' {
  /** Typographyのバリアントオーバーライドの型定義 */
  interface TypographyPropsVariantOverrides {
    /** エラーメッセージ用のバリアント */
    error: true;
    /** 警告メッセージ用のバリアント */
    warning: true;
  }
}

/** Buttonコンポーネントのカラー拡張定義 */
declare module '@mui/material/Button' {
  /** Buttonのカラーオーバーライドの型定義 */
  interface ButtonPropsColorOverrides {
    /** カスタムグレー色のボタン */
    customGray: true;
  }
}

/** アプリケーション全体で使用するテーマの定義 */
export const theme = createTheme({
  /** 共通で使う色を指定 */
  blue: { light: blue[100], main: blue[500], dark: blue[700] },
  cyan: { light: cyan[100], main: cyan[500], dark: cyan[700] },
  green: { light: green[100], main: green[500], dark: green[700] },
  grey: { light: grey[100], main: grey[500], dark: grey[700] },
  required: yellow[100],

  /** デフォルトの文字サイズ */
  typography: {
    allVariants: { fontSize: DEFAULT_FONT_SIZE }, // すべての文字サイズ
    error: { fontSize: DEFAULT_FONT_SIZE, color: red[500] },
    warning: { fontSize: DEFAULT_FONT_SIZE, color: yellow[500] },
    button: { fontSize: DEFAULT_FONT_SIZE }, // ボタンの文字サイズ
  },

  /** パレット */
  palette: {
    /** 灰色のボタン用に追加（図検） */
    customGray: {
      light: grey[200],
      main: grey[600],
      dark: grey[800],
      contrastText: '#ffffff',
    },
  },
});
