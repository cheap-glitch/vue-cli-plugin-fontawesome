const { validator } = require('../src/validation');

test("returns an error when there are extra properties on the main options object", () => { // {{{

	expect(validator({ foo: true                       })).toBe(false);
	expect(validator({ component: 'fa-icon', foo: true })).toBe(false);

	expect(validator({                                 })).toBe(true);

}); // }}}

test("returns an error when the main properties are not the right type", () => { // {{{

	// Component name
	expect(validator({ component: 0            })).toBe(false);
	expect(validator({ component: ['fa-icon']  })).toBe(false);

	// Components names
	expect(validator({ components: 'fa-icon'   })).toBe(false);
	expect(validator({ components: ['fa-icon'] })).toBe(false);

	// Imports
	expect(validator({ imports: false          })).toBe(false);
	expect(validator({ imports: 'pro-solid'    })).toBe(false);

}); // }}}

test("returns an error when the imports are invalid", () => { // {{{

	// List of sets
	expect(validator({ imports: [{ set: []                                             }] })).toBe(false);
	expect(validator({ imports: [{ set: 'pro-solid'                                    }] })).toBe(false);
	expect(validator({ imports: ['pro-duotone', []]                                    })).toBe(false);
	expect(validator({ imports: ['pro-duotone', { icons: []                            }] })).toBe(false);

	// List of icons
	expect(validator({ imports: { guitar: 1                                            }})).toBe(false);
	expect(validator({ imports: { guitar: true                                         }})).toBe(false);
	expect(validator({ imports: { github: { '@fortawesome/free-brands-svg-icons': true }} })).toBe(false);

	expect(validator({ imports: ['pro-duotone']                                        })).toBe(true);
	expect(validator({ imports: [{ set: 'pro-duotone', icons: ['guitar', 'house']      }] })).toBe(true);
	expect(validator({ imports: { guitar: 'pro-regular'                                }})).toBe(true);
	expect(validator({ imports: { github: '@fortawesome/free-brands-svg-icons'         }})).toBe(true);
	expect(validator({ imports: { github: ['@fortawesome/free-brands-svg-icons']       }})).toBe(true);

}); // }}}

test("returns an error when a component name is invalid", () => { // {{{

	// Name isn't a string
	expect(validator({ components: { icon: 0           }})).toBe(false);
	expect(validator({ components: { icon: ['fa-icon'] }})).toBe(false);

	// Name contains invalid characters
	expect(validator({ component: 'fa-icon!'           })).toBe(false);
	expect(validator({ components: { icon: '@icon'     }})).toBe(false);

}); // }}}

test("returns an error when a set name is invalid", () => { // {{{

	// List of sets
	expect(validator({ imports: ['pro']                           })).toBe(false);
	expect(validator({ imports: ['@free-brands']                  })).toBe(false);
	expect(validator({ imports: [{ set: 'pro', icons: []          }] })).toBe(false);
	expect(validator({ imports: [{ set: '@free-brands', icons: [] }] })).toBe(false);

	// List of icons
	expect(validator({ imports: { file: 'pro'                     }})).toBe(false);
	expect(validator({ imports: { github: '@free-brands'          }})).toBe(false);

}); // }}}

test("returns an error when an icon name is invalid", () => { // {{{

	// List of sets
	expect(validator({ imports: [{ set: 'pro-regular', icons: ['coffee!']         }] })).toBe(false);
	expect(validator({ imports: [{ set: 'pro-regular', icons: ['link/external']   }] })).toBe(false);
	expect(validator({ imports: [{ set: 'pro-regular', icons: ['question_circle'] }] })).toBe(false);

	// List of icons
	expect(validator({ imports: { 'coffee!': 'pro-regular'                        }})).toBe(false);
	expect(validator({ imports: { 'link/external': 'pro-regular'                  }})).toBe(false);
	expect(validator({ imports: { 'question_circle': 'pro-regular'                }})).toBe(false);

	expect(validator({ imports: [{ set: 'pro-regular', icons: ['coffee']          }] })).toBe(true);
	expect(validator({ imports: [{ set: 'pro-regular', icons: ['link-external']   }] })).toBe(true);
	expect(validator({ imports: [{ set: 'pro-regular', icons: ['question-circle'] }] })).toBe(true);
	expect(validator({ imports: { 'coffee': 'pro-regular'                         }})).toBe(true);
	expect(validator({ imports: { 'link-external': 'pro-regular'                  }})).toBe(true);
	expect(validator({ imports: { 'question circle': 'pro-regular'                }})).toBe(true);

}); // }}}
