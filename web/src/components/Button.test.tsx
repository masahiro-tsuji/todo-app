import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // 便利なマッチャー（toBeInTheDocumentなど）を使うため
import { Button } from './Button';

describe('Button コンポーネントのテスト', () => {
  test('OKボタンが表示されること', () => {
    // 1. コンポーネントを仮想画面にレンダリング（描画）する
    render(<Button name="OK" />);

    // 2. 画面内から「クリックしてね」というテキストを探す
    const buttonElement = screen.getByText('OK');

    // 3. そのボタンがちゃんと画面（DOM）に存在するか検証する
    expect(buttonElement).toBeInTheDocument();
  });
});
