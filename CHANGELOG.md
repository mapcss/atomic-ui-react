# [1.0.0-beta.30](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.29...1.0.0-beta.30) (2022-04-30)


### Features

* **switch:** switch to be ref forwardable component ([ed16c2e](https://github.com/mapcss/atomic-ui-react/commit/ed16c2e4c4bcb356f9dff31229009223c7ae5a30))
* **tooltip:** add `Tooltip` and `TooltipProvider` components ([a4932ec](https://github.com/mapcss/atomic-ui-react/commit/a4932ecb2403cfe442085be0dff81a9f16b33d0e))

# [1.0.0-beta.29](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.28...1.0.0-beta.29) (2022-04-27)


### Features

* **transition:** add `mode` field that current transition mode ([cc96aa3](https://github.com/mapcss/atomic-ui-react/commit/cc96aa3236edbb352a401757e9c098008c1fa458))
* **transition:** add transition child ([0ce4075](https://github.com/mapcss/atomic-ui-react/commit/0ce4075a28af9b44115bdecddadf9689bac84b55))
* **transition:** add transition context and `isRoot` props ([cb333d8](https://github.com/mapcss/atomic-ui-react/commit/cb333d873b5f1131d065231f0d28af1e138bf410))

# [1.0.0-beta.28](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.27...1.0.0-beta.28) (2022-04-26)


### Bug Fixes

* **transition:** rename `cleanTransitionProps` to `cleanTransitionMap` ([6b58a4a](https://github.com/mapcss/atomic-ui-react/commit/6b58a4ad9b5fe3178bc1f3eb63ef0a38ef148216))


### Features

* **transition:** `useTransition` return `isFirst` field ([c6e589a](https://github.com/mapcss/atomic-ui-react/commit/c6e589ad0bdc71be9daa5fc649b51c2f2842247e))
* **transition:** accept number to `duration` field ([6e00b5b](https://github.com/mapcss/atomic-ui-react/commit/6e00b5b3b2a67ba96e11f0126fd8527f6d1b5fb7))
* **transition:** change role of `TransitionProvier` to as render props ([14fc72b](https://github.com/mapcss/atomic-ui-react/commit/14fc72b64fe360a1d7722c3f95e4d0efcbeab087))
* **transition:** rename `target` to `duration` ([f2a026d](https://github.com/mapcss/atomic-ui-react/commit/f2a026df4492a5a8f4af3ee6b8e1b127a9abf2a9))
* **transition:** rename `TransitionProvider` to `Transition` ([9befd74](https://github.com/mapcss/atomic-ui-react/commit/9befd74dee3328bbdcc2f8476be26022cb6671a7))

# [1.0.0-beta.27](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.26...1.0.0-beta.27) (2022-04-26)


### Features

* **transition:** add `cleanTransitionProps` to return ([222cfdf](https://github.com/mapcss/atomic-ui-react/commit/222cfdf5880c5ef843365ff15c637e8b80b7c3c9))
* **transition:** improve default renderer if there is `leaved`, the DOM will keep ([abff521](https://github.com/mapcss/atomic-ui-react/commit/abff52179af157988ac16a6bae0e4c21510c41d6))
* **transition:** return `cleanTransitionProps` by `useTransition` ([07c914c](https://github.com/mapcss/atomic-ui-react/commit/07c914ceacb51a326ebc64fb41d24e4fa363030e))

# [1.0.0-beta.26](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.25...1.0.0-beta.26) (2022-04-25)


### Bug Fixes

* **transition:** dirty class name to clean waht is non-duplicated, clean space token ([d4949c8](https://github.com/mapcss/atomic-ui-react/commit/d4949c81dd1dac7c326826c1e65ab7665109608a))


### Features

* **transition:** add `isShowable` filed to `useTransition` return value ([9efe580](https://github.com/mapcss/atomic-ui-react/commit/9efe5804095ceaec7e08a47c6aa3320dd77a430b))
* **transition:** export utility for dirty class name ([c02034f](https://github.com/mapcss/atomic-ui-react/commit/c02034f6fd13d3f97d62ebc16bb744f518f0874a))
* **transition:** return `classNames` that is array of transition tokens ([2eda2b6](https://github.com/mapcss/atomic-ui-react/commit/2eda2b649b210fad965cdd030c31a4c5471c3a00))
* **transition:** transition provider should mutate DOM className directly ([000c75e](https://github.com/mapcss/atomic-ui-react/commit/000c75e48d09ff4f2706743e5f485e4b33993f31)), closes [#7](https://github.com/mapcss/atomic-ui-react/issues/7)

# [1.0.0-beta.25](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.24...1.0.0-beta.25) (2022-04-25)


### Bug Fixes

* **transition:** occur transition when parent is updated ([aa42ee1](https://github.com/mapcss/atomic-ui-react/commit/aa42ee1fdf2964c0a2ef3a1c85fb81e7b37c4f73)), closes [#6](https://github.com/mapcss/atomic-ui-react/issues/6)


### Features

* **hooks:** add `useMutated` hooks that observe deps update ([c915eb8](https://github.com/mapcss/atomic-ui-react/commit/c915eb8078cccb78f8874f92c7aa9f4e4006eb54))

# [1.0.0-beta.24](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.23...1.0.0-beta.24) (2022-04-24)


### Features

* **transition:** add `immediate` flag to handle first mount transition behavior ([8cf381c](https://github.com/mapcss/atomic-ui-react/commit/8cf381c57b2256d4fc6349c9daec9455142c54ad)), closes [#4](https://github.com/mapcss/atomic-ui-react/issues/4)

# [1.0.0-beta.23](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.22...1.0.0-beta.23) (2022-04-24)


### Bug Fixes

* **transition:** if child has `ref`, refer it ([cb67012](https://github.com/mapcss/atomic-ui-react/commit/cb6701228cbd2115302420398282af6be5c8215d)), closes [#3](https://github.com/mapcss/atomic-ui-react/issues/3)

# [1.0.0-beta.22](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.21...1.0.0-beta.22) (2022-04-24)


### Features

* add utility for checking contain element under the parent element ([44fd773](https://github.com/mapcss/atomic-ui-react/commit/44fd773e157daaa6aec9c8babaf5f8f44c13f5c1))

# [1.0.0-beta.21](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.20...1.0.0-beta.21) (2022-04-23)


### Bug Fixes

* **hooks:** rename `useOnMount` to `useLifecycle` ([431d15b](https://github.com/mapcss/atomic-ui-react/commit/431d15b1c506d116d451fd2164b9cd1537dd534a))


### Features

* **transition:** add `entered` and `leaved` transition props ([03d3161](https://github.com/mapcss/atomic-ui-react/commit/03d3161aceb88c9190f1b0aa08e78b749cae99fd))


### Performance Improvements

* **transition:** remove unnessesary deps from hooks for avoid re-culculation ([d8d93f8](https://github.com/mapcss/atomic-ui-react/commit/d8d93f803b320cf971d4637e27f18982d13a533f))

# [1.0.0-beta.20](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.19...1.0.0-beta.20) (2022-04-23)


### Features

* **hooks:** add `useTimeout` hooks that safe `setTimeout` with effect ([431471e](https://github.com/mapcss/atomic-ui-react/commit/431471e1760fc4b1404a803adf9d8f816f0ad23b))

# [1.0.0-beta.19](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.18...1.0.0-beta.19) (2022-04-21)


### Bug Fixes

* **tab:** prevent focus tab element at first mount ([31d34f2](https://github.com/mapcss/atomic-ui-react/commit/31d34f214b2db3d39e8d08dc594f75358d100055))


### Features

* **util:** add checking Node.js environment or not ([339f073](https://github.com/mapcss/atomic-ui-react/commit/339f073f330659f2d2e0d9da4334d442dbf3fcdb))

# [1.0.0-beta.18](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.17...1.0.0-beta.18) (2022-04-21)


### Features

* **tab:** tab components to be generic forwawrd reffable component ([e7f8b13](https://github.com/mapcss/atomic-ui-react/commit/e7f8b132fd04366d897b89be96505faad87fe035))

# [1.0.0-beta.17](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.16...1.0.0-beta.17) (2022-04-21)


### Bug Fixes

* **tab:** add optional parameter accessor to get index ([d06d2a2](https://github.com/mapcss/atomic-ui-react/commit/d06d2a230fd68ceff1d53f77343cfab5eb827db9))

# [1.0.0-beta.16](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.15...1.0.0-beta.16) (2022-04-20)


### Features

* **transition:** add `onChange` handler to `TransitionProvider` that call on change transtion state ([a4e5e9f](https://github.com/mapcss/atomic-ui-react/commit/a4e5e9f4f3751ef457a5c5ec8077becad339e2bf))
* **transition:** add `render` props to controll rendering actulal element ([c33c253](https://github.com/mapcss/atomic-ui-react/commit/c33c253d0b51d356516c5170c2c97492c5a5a9a3))
* **transition:** export transition lifecycle on `useTransition` and `TransitionProvider` ([4b037fe](https://github.com/mapcss/atomic-ui-react/commit/4b037fe4cddecb565abd342ebd2ee6dbe0958221))

# [1.0.0-beta.15](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.14...1.0.0-beta.15) (2022-04-19)


### Features

* **transition:** export transition shared types as global module ([0c230f0](https://github.com/mapcss/atomic-ui-react/commit/0c230f0f24e5f688b2ffe67517e0ceb4512599be))
* **transition:** export transition utility to global ([2321e12](https://github.com/mapcss/atomic-ui-react/commit/2321e1290fb55d19198700607306a04961e14e92))
* **transition:** rename `useTransitionTiming` to `useTransitionLifecycle`, export as global module ([6921b54](https://github.com/mapcss/atomic-ui-react/commit/6921b5406d045fcb09b73fff205b09ef22c6113d))
* **transition:** rename field of `isRendered` to `isCompleted` ([db5de48](https://github.com/mapcss/atomic-ui-react/commit/db5de48c49b2c1a204c23ea49f8dd3156244083d))

# [1.0.0-beta.14](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.13...1.0.0-beta.14) (2022-04-19)


### Bug Fixes

* **transition:** fix isRendered state logic, remove unnessesary state for performance ([59bb16c](https://github.com/mapcss/atomic-ui-react/commit/59bb16c58998039176171b73554697c2d8f1247b))

# [1.0.0-beta.13](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.12...1.0.0-beta.13) (2022-04-18)


### Features

* **transition:** add `TransitionProvider` Component that full managed transition props under child ([835ac4c](https://github.com/mapcss/atomic-ui-react/commit/835ac4c3a6573c61f8fdd2fb471198dfc01917a0))
* **transition:** rename props name of `show` to `isShow` and `isRendered` ([9a74592](https://github.com/mapcss/atomic-ui-react/commit/9a745928b42afcd98c2da9597120fed5a7d99403))

# [1.0.0-beta.12](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.11...1.0.0-beta.12) (2022-04-18)


### Bug Fixes

* **transition:** change `useTransitionTiming` hooks interface ([da93d7e](https://github.com/mapcss/atomic-ui-react/commit/da93d7eb25f69fec5226c011e16bada88e723589))
* **transition:** timer id should check data types ([80c830c](https://github.com/mapcss/atomic-ui-react/commit/80c830c4e478b4d0436df9e28faae0af4e93fb5d))


### Features

* **transition:** rename props name to `target` from `ref` ([fe58f08](https://github.com/mapcss/atomic-ui-react/commit/fe58f080830ec756fc35b5ec6d9bdaba3ee6bbdc))
* **transition:** treat transition delay with transition duration ([13d7f72](https://github.com/mapcss/atomic-ui-react/commit/13d7f729b7fdaf31253268aedd38df15996cd5f1))
* **util:** export pure utility functions ([eca7b60](https://github.com/mapcss/atomic-ui-react/commit/eca7b60b00507be67ad490d88d9868fd840f70b7))

# [1.0.0-beta.11](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.10...1.0.0-beta.11) (2022-04-18)


### Bug Fixes

* **tab:** not use `Array#findLastIndex` bacause it API is too new ([0965671](https://github.com/mapcss/atomic-ui-react/commit/09656714991f442022ceaa6fc027de8cd87ba295))

# [1.0.0-beta.10](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.9...1.0.0-beta.10) (2022-04-18)


### Bug Fixes

* **hooks:** in effect, call callback function every rendering ([d4b26b9](https://github.com/mapcss/atomic-ui-react/commit/d4b26b9146dfc34e95297b5999e595ad8633a7f3))
* **transition:** do not use `useLayoutEffect` ([1daa6a4](https://github.com/mapcss/atomic-ui-react/commit/1daa6a4cfdbf24ceb56ce9066d548f87782ae143))
* **transition:** fix transition timing logic ([bb1d4f3](https://github.com/mapcss/atomic-ui-react/commit/bb1d4f32b40c12cae9462a0131a74a9382643670))
* **transition:** fix updating transition state synchronicity ([1de8a20](https://github.com/mapcss/atomic-ui-react/commit/1de8a20b3bcd94b27718e12813529d469d6c482e))

# [1.0.0-beta.9](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.8...1.0.0-beta.9) (2022-04-17)


### Features

* **hooks:** add `useOnMount` hooks that call on mount/unmount and so on ([91589d4](https://github.com/mapcss/atomic-ui-react/commit/91589d4a725082b4d05bd7bd376730a68c8fcb88))

# [1.0.0-beta.8](https://github.com/mapcss/atomic-ui-react/compare/1.0.0-beta.7...1.0.0-beta.8) (2022-04-17)


### Features

* **switch:** rename prop name of `checked` to `isChecked` ([9a4f396](https://github.com/mapcss/atomic-ui-react/commit/9a4f3965aaf81483d80e98859554b0ba356c1402))
* **tab:** add aria-disabled attribute to hook ([bd196c9](https://github.com/mapcss/atomic-ui-react/commit/bd196c99e12cbbbca65e4b7d6bac7414efbb6478))
* **tab:** export tab WAI-ARIA hooks ([4a55cb1](https://github.com/mapcss/atomic-ui-react/commit/4a55cb1e79433ca0bd22d8fc3be4938085558021))
* **tab:** if tab aria-disabled is true, ignore to update state on keydown `Home` and `End` ([894dc82](https://github.com/mapcss/atomic-ui-react/commit/894dc82b336704bd0848418911a931a8e4a6894b))
* **tab:** if the tab is aria-disabled true, ignore keyboard interaction ([75cb117](https://github.com/mapcss/atomic-ui-react/commit/75cb1176e895ca3b717527b02b4525b869383086))
* **tab:** pass dynamic context to renderProps function ([76f81f9](https://github.com/mapcss/atomic-ui-react/commit/76f81f920709c9c1469bb1c60a61c6442e8b5859))


### Performance Improvements

* **tab:** remove duplicated const for reduce bundle size ([2844880](https://github.com/mapcss/atomic-ui-react/commit/2844880b3d8dfbb9507fb573163461c75fbf808b))

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
