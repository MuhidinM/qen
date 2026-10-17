import { tokens } from './index.js';

const label = {
  fontSize: 'var(--qen-font-size-12)',
  color: 'var(--qen-color-text-muted)',
} as const;

/** The design system at a glance: palettes, semantic colours, type and spacing scales. */
export const Palettes = () => (
  <div style={{ display: 'grid', gap: 'var(--qen-space-5)' }}>
    {Object.entries(tokens.color).map(([name, palette]) => (
      <section key={name}>
        <h2 style={{ fontSize: 'var(--qen-font-size-14)', margin: 0 }}>{name}</h2>
        <div
          style={{ display: 'flex', gap: 'var(--qen-space-2)', marginTop: 'var(--qen-space-2)' }}
        >
          {Object.entries(palette).map(([shade, value]) => (
            <div key={shade}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: value,
                  borderRadius: 'var(--qen-radius-md)',
                  boxShadow: 'var(--qen-shadow-1)',
                }}
              />
              <div style={label}>{shade}</div>
            </div>
          ))}
        </div>
      </section>
    ))}
  </div>
);

export const SemanticColors = () => (
  <div style={{ display: 'grid', gap: 'var(--qen-space-3)' }}>
    {[
      ['Public holiday', 'public'],
      ['Orthodox holiday', 'orthodox'],
      ['Islamic holiday', 'islamic'],
    ].map(([text, key]) => (
      <span
        key={key}
        style={{
          background: `var(--qen-color-holiday-${key}-tint)`,
          color: `var(--qen-color-holiday-${key}-text)`,
          padding: 'var(--qen-space-2) var(--qen-space-3)',
          borderRadius: 'var(--qen-radius-md)',
        }}
      >
        {text}
      </span>
    ))}
    <span style={{ color: 'var(--qen-color-text-muted)' }}>Muted text</span>
    <span style={{ color: 'var(--qen-color-accent-text)' }}>Accent text</span>
    <span
      style={{
        background: 'var(--qen-color-accent)',
        color: 'var(--qen-color-on-accent)',
        padding: 'var(--qen-space-2) var(--qen-space-4)',
        borderRadius: 'var(--qen-radius-md)',
        justifySelf: 'start',
      }}
    >
      Selected day
    </span>
  </div>
);

export const TypeScale = () => (
  <div style={{ display: 'grid', gap: 'var(--qen-space-2)' }}>
    {Object.values(tokens.fontSize).map((size) => (
      <div
        key={size}
        style={{
          fontSize: `var(--qen-font-size-${size})`,
          lineHeight: 'var(--qen-line-height-tight)',
        }}
      >
        {size}px · መስከረም ፲፯ · رمضان · Meskerem 17
      </div>
    ))}
  </div>
);
