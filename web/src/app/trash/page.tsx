'use client';

import { PagePaper } from '@/components';
import { TrashList } from '@/features/trash-list';

export default function TrashPage() {
  return (
    <PagePaper maxWidth='900px' title='ゴミ箱'>
      <TrashList />
    </PagePaper>
  );
}
