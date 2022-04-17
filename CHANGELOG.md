# [1.0.0-beta.7](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.6...1.0.0-beta.7) (2022-04-17)


### Features

* **hooks:** add `useId` that generate universal uniqu id ([5737a12](https://github.com/mapcss/atomic-ui-react/commit/5737a124c943239df9876efc7a959bd80526cab2))
* **ssr:** add ensuring global id is same with server side and client side ([64f636e](https://github.com/mapcss/atomic-ui-react/commit/64f636edc1a59a622cb835afdfdfb78eb51b0850))
* **tab:** use global id and local id combination for ARIA attribute ([bdb8411](https://github.com/mapcss/atomic-ui-react/commit/bdb84113252d98eff7414e20bfc903062db42c62))

# [1.0.0-beta.6](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.5...1.0.0-beta.6) (2022-04-17)


### Bug Fixes

* all export component to be `.ts` ext ([aeab295](https://github.com/mapcss/atomic-ui-react/commit/aeab2950c75d5bbd70b5fcd034e0d6ca7bbce76f))
* **hooks:** fix `useIsomorphicLayoutEffect` typo ([b47201b](https://github.com/mapcss/atomic-ui-react/commit/b47201bff94905b3d9ce89ca7491461d8ef67f76))
* **transition:** fix export shim ([e0f83bf](https://github.com/mapcss/atomic-ui-react/commit/e0f83bfcb19fa1f4929ab84aeba47acc3dede3c6))


### Features

* **switch:** export `useSwitchAria` hooks that memorized role switch aria ([0da8891](https://github.com/mapcss/atomic-ui-react/commit/0da8891d1c13740fa60c88f6ce8d0a637486ff39))

# [1.0.0-beta.5](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.4...1.0.0-beta.5) (2022-04-16)


### Features

* **tab:** add `renderProps` props that dynamic rendering props with context ([3f11983](https://github.com/mapcss/atomic-ui-react/commit/3f11983f92fb36e051ce5a4e69875eb48325bca8))
* **tab:** add keyboard shortcut of `End` and `PageDown` ([9d43caf](https://github.com/mapcss/atomic-ui-react/commit/9d43cafac42a80c34f03c59cbb6f9a03d16a6fb9))
* **tab:** add keyboard shortcut of `Home` and `PageUp` ([d22aba9](https://github.com/mapcss/atomic-ui-react/commit/d22aba9763c0435a15ffdb5e52f359f42d7b803d))
* **tab:** add switching vertical/horizontal mode ([574b04d](https://github.com/mapcss/atomic-ui-react/commit/574b04de5c8c5500be2cd215cc69b05eed43af8d))

# [1.0.0-beta.4](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.3...1.0.0-beta.4) (2022-04-16)


### Features

* **hooks:** add `useIsFirstMount` hooks ([39bb054](https://github.com/mapcss/atomic-ui-react/commit/39bb05401d229e040534aaa492620e2bded5e60c))
* **tab:** add key board shortcut of `ArrowLeft` and `ArrowRight` ([5b585e7](https://github.com/mapcss/atomic-ui-react/commit/5b585e77dc6383381fcadee9a26efef5719199b8))
* **tab:** add WAI-ARIA attribute of aria-controls ([a467563](https://github.com/mapcss/atomic-ui-react/commit/a4675630b9094e8602a61276b265832c17f342b4))

# [1.0.0-beta.3](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.2...1.0.0-beta.3) (2022-04-16)


### Bug Fixes

* **tab:** rename `Tab` component props of `tag` to `as` ([50d5358](https://github.com/mapcss/atomic-ui-react/commit/50d5358cb6b7720deb72316277f69ea3e8629df7))
* **tab:** rename props of Tab to `isSelected` from `isSelect` ([980fff3](https://github.com/mapcss/atomic-ui-react/commit/980fff30f1dd984c46cdb3c67607cdf228dcefb4))


### Features

* **tab:** add `TabProvider` component that manage children ([58359bc](https://github.com/mapcss/atomic-ui-react/commit/58359bcebc545d8e813944a429da5feef97c2454))
* **tab:** add searching recursive children to traverse ([79b9aa2](https://github.com/mapcss/atomic-ui-react/commit/79b9aa2038b3c9bc031284a9d80c71c512789345))
* **tab:** add tab provider to controllable ([baee3f7](https://github.com/mapcss/atomic-ui-react/commit/baee3f75c6315a2e849c06f59eda3780c7f5f51c))
* **tab:** add uncontrol component feature to tab provider ([f3da5fb](https://github.com/mapcss/atomic-ui-react/commit/f3da5fbc20195eaebd70b2385db5fa6eed7a65ba))

# [1.0.0-beta.2](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.1...1.0.0-beta.2) (2022-04-15)


### Bug Fixes

* fix detect browser env ([5ca8457](https://github.com/mapcss/atomic-ui-react/commit/5ca84579fddd88ad4427420ce1f9813c2cb507a7))
* fix export name ([bf21533](https://github.com/mapcss/atomic-ui-react/commit/bf21533db2cec66eac70787898b59754d58dc323))


### Features

* **hooks:** add cleaning transition class name ([36f98b4](https://github.com/mapcss/atomic-ui-react/commit/36f98b4f051aa716638c28e8bcc13ff2f26d1ac1))
* **tab:** add basic `TabList`, `TabPanel`, `PureTab` component, add `Filter` component ([61ed757](https://github.com/mapcss/atomic-ui-react/commit/61ed757ae35bbf2413a71a324e7e514defa46d64))

# 1.0.0-beta.1 (2022-04-14)


### Features

* **components:** add `Switch` component ([42047d7](https://github.com/mapcss/atomic-ui-react/commit/42047d7303eea00b85dda86db68e0b466eed3143))
* **components:** add `Transition` component that manage class name base transition ([fa7c25d](https://github.com/mapcss/atomic-ui-react/commit/fa7c25d5b47a025885beaa81fa366dbbc2e9f5d6))
* **hooks:** add `useBoolean` hooks ([9406d31](https://github.com/mapcss/atomic-ui-react/commit/9406d31383962fb7674e24e9071c8b3156e6cd65))
* **hooks:** add `useTransition` hooks ([5b7e441](https://github.com/mapcss/atomic-ui-react/commit/5b7e4416e59387672f34ed8939576b41e10ce18d))
