const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../node_modules/@expo/vector-icons');

const iconSets = [
  'AntDesign',
  'Entypo',
  'EvilIcons',
  'Feather',
  'FontAwesome',
  'FontAwesome5',
  'Fontisto',
  'Foundation',
  'Ionicons',
  'MaterialCommunityIcons',
  'MaterialIcons',
  'Octicons',
  'SimpleLineIcons',
  'Zocial',
];

function ensureVectorIcons() {
  fs.mkdirSync(targetDir, { recursive: true });

  const pkgJson = {
    name: '@expo/vector-icons',
    version: '15.0.2',
    main: 'index.js',
    types: 'index.d.ts',
  };
  fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

  const createIconSetCode = `import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import * as Font from 'expo-font';

export default function createIconSet(glyphMap, fontName, fontFile) {
  let isFontLoaded = false;
  let loadPromise = null;

  function loadFontAsync() {
    if (isFontLoaded) return Promise.resolve();
    if (!loadPromise && fontFile) {
      loadPromise = Font.loadAsync({ [fontName]: fontFile })
        .then(() => {
          isFontLoaded = true;
        })
        .catch(() => {
          isFontLoaded = true;
        });
    }
    return loadPromise || Promise.resolve();
  }

  function IconComponent({ name, size = 12, color = 'black', style, children, ...props }) {
    const [, setLoaded] = useState(isFontLoaded);

    useEffect(() => {
      if (!isFontLoaded) {
        loadFontAsync().then(() => setLoaded(true));
      }
    }, []);

    let glyph = name ? glyphMap[name] || '?' : '';
    if (typeof glyph === 'number') {
      glyph = String.fromCodePoint(glyph);
    }

    return (
      <Text
        selectable={false}
        {...props}
        style={[
          {
            fontSize: size,
            color,
            fontFamily: fontName,
            fontWeight: 'normal',
            fontStyle: 'normal',
          },
          style,
        ]}
      >
        {glyph}
        {children}
      </Text>
    );
  }

  IconComponent.glyphMap = glyphMap;
  IconComponent.font = fontFile ? { [fontName]: fontFile } : {};
  IconComponent.loadFont = loadFontAsync;
  return IconComponent;
}
`;
  fs.writeFileSync(path.join(targetDir, 'createIconSet.js'), createIconSetCode);

  for (const name of iconSets) {
    const fontFileName = name === 'FontAwesome5' ? 'FontAwesome5_Regular.ttf' : `${name}.ttf`;
    const glyphFileName = name === 'FontAwesome5' ? 'FontAwesome5Free.json' : `${name}.json`;
    const glyphAbs = path.resolve(targetDir, `../../react-native-vector-icons/glyphmaps/${glyphFileName}`);
    const fontAbs = path.resolve(targetDir, `../../react-native-vector-icons/Fonts/${fontFileName}`);
    if (!fs.existsSync(glyphAbs) || !fs.existsSync(fontAbs)) {
      throw new Error(`Missing asset for ${name}: ${glyphAbs} or ${fontAbs}`);
    }
    const setCode = `import createIconSet from './createIconSet';
import glyphMap from '../../react-native-vector-icons/glyphmaps/${glyphFileName}';
const fontFile = require('../../react-native-vector-icons/Fonts/${fontFileName}');

const Icon = createIconSet(glyphMap, '${name}', fontFile);
export default Icon;
`;
    fs.writeFileSync(path.join(targetDir, `${name}.js`), setCode);

    const dtsCode = `import React from 'react';
import { TextProps } from 'react-native';
export interface IconProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
}
declare const Icon: React.ComponentType<IconProps> & {
  glyphMap: Record<string, number | string>;
  font: Record<string, any>;
  loadFont: () => Promise<void>;
};
export default Icon;
`;
    fs.writeFileSync(path.join(targetDir, `${name}.d.ts`), dtsCode);
  }

  const indexCode =
    iconSets.map(n => `import ${n} from './${n}';`).join('\n') +
    `\nimport createIconSet from './createIconSet';\n\nexport {\n  createIconSet,\n  ` +
    iconSets.join(',\n  ') +
    `\n};\n`;
  fs.writeFileSync(path.join(targetDir, 'index.js'), indexCode);

  const indexDts =
    iconSets.map(n => `export { default as ${n} } from './${n}';`).join('\n') +
    `\nexport declare function createIconSet(glyphMap: any, fontName: string, fontFile?: any): any;\n`;
  fs.writeFileSync(path.join(targetDir, 'index.d.ts'), indexDts);

  // Ensure @react-native/assets-registry/registry for react-native-svg on Web
  const assetsRegDir = path.resolve(__dirname, '../node_modules/@react-native/assets-registry');
  fs.mkdirSync(assetsRegDir, { recursive: true });
  fs.writeFileSync(
    path.join(assetsRegDir, 'package.json'),
    JSON.stringify({ name: '@react-native/assets-registry', version: '0.81.5', main: 'registry.js' }, null, 2)
  );
  fs.writeFileSync(
    path.join(assetsRegDir, 'registry.js'),
    `const AssetRegistry = require('react-native/asset-registry');\nmodule.exports = AssetRegistry;\n`
  );

  // Ensure react-native-gesture-handler/Swipeable alias to ReanimatedSwipeable for RNGH v3
  const swipeableDir = path.resolve(__dirname, '../node_modules/react-native-gesture-handler/Swipeable');
  fs.mkdirSync(swipeableDir, { recursive: true });
  fs.writeFileSync(
    path.join(swipeableDir, 'package.json'),
    JSON.stringify({
      main: '../lib/module/components/ReanimatedSwipeable/',
      module: '../lib/module/components/ReanimatedSwipeable/',
      'react-native': '../src/components/ReanimatedSwipeable/',
      types: '../lib/typescript/components/ReanimatedSwipeable/',
    }, null, 2)
  );
}

ensureVectorIcons();
module.exports = { ensureVectorIcons };

