<template>
  <!--
    Vertical sidebar ad — desktop only.

    `hidden lg:flex` (was `sticky` + `w-full lg:w-80`):
      Below `lg` the aside is not rendered at all. A `vertical` unit has no
      ad inventory at mobile widths (~352px), so mounting it there only
      produced an empty reserved box plus an `unfilled` request. With the
      parent hidden on mobile, the Adsense slot's width resolves to 0, so
      the ResizeObserver never fires the push there — no wasted request.

    `w-80` (no `w-full`):
      Deterministic 320px, and only on the breakpoint where the slot
      actually exists and vertical inventory is available.

    `:responsive="false"`:
      A fixed vertical sidebar unit should not request
      data-full-width-responsive.
  -->
  <aside class="hidden lg:block sticky top-20 w-80 shrink-0 my-4">
    <Adsense ad-slot="9118007770" ad-format="vertical" :responsive="false" />
  </aside>
</template>