
// Map viewing values.
const tile_width = 64;
const tile_height = 64;

var view_width = 11;
var view_height = 11;
var view_middleX = view_width >> 1;
var view_middleY = view_height >> 1;

// Where to draw the player on screen.
var playerX = 5;
var playerY = 5;

var default_width = tile_width * view_width;
var default_height = tile_height * view_height;

// Offset for drawing water and other "cycling" tiles.
var offsetX = 0;
var offsetY = 0;

// Wind direction, used for "cycling" tiles.
var windX = +1;
var windY = +1;

// Position of the viewer relative to the map.
var posX = 5;
var posY = 5;

// Timer settings.
const animation_time = 100; // 100 milliseconds = 10 frames per second.

// Map polling time.
const polling_time = 250; // Update map every 250 milliseconds (4fps).
var polling_counter = 0; // Current polling counter (counts up).

// User login status.
var player_name = "";
var session = "";

// Server address. Default to the current page origin so the frontend talks to
// the same host/port that served the page and avoids cross-origin CORS issues.
var server_addr = (typeof window !== 'undefined' && window.location && window.location.origin)
	? window.location.origin
	: "http://localhost";

// Location of asset files.
const asset_path = "assets/64x64/";

// Map data.
var map_width = 20;
var map_height = 20;

var map = [
	['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', '.', 'W', 'g', 't', 't', 'gk','g', 't', 'g', 'g', 'g', ],
	['S', 'S', 'S', 'S', 'S', 'S', 'g', 'g', 'g', 'g', 'W', 'g', 't', ';', 't', 't', 't', 'g', 'g', 'g', ],
	['S', 'wa','w', 'w', 'w', 'S', 'g', 'g', 'g', 'W', 'W', 'g', 't', 't', 't', 't', 't', 't', 'g', 'g', ],
	['S', 'w', 'w', 'w', 'w', 'S', 'g', 'g', 'W', 'W', 'g', 'g', 't', 't', 't', 't', 't', 'g', 'g', 'g', ],
	['S', 'S', 'S', 'wd','S', 'S', 'g', 'g', 'W', 'g', 'g', 't', 't', 't', 'g', 'g', 'g', 'g', 'g', 'g', ],
	['g', 'g', ',', '_', 'g', 'g', 'g', 'W', 'W', 'W', 'g', 't', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', ],
	['.', 'g', 'g', '_', 'g', 'g', 'g', 'W', 'g', 'Wb','.', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', ],
	['_', '_', '_', '_', 'g', 'g', 'W', 'W', 'g', 'W', 'W', 'g', 'g', 'g', 'g', '_', '_', '_', '_', '_', ],
	['_', 'g', 't', 't', 'g', 'W', 'W', 'W', 'g', 'g', 'W', 'g', 'g', 'g', 'g', '_', 'g', 'g', 'g', 'g', ],
	['_', 'g', 'g', 't', 'g', 'W', 'W', 'g', 'g', 'g', 'W', 'g', 'g', 'g', 'B', 'fD','B', 'g', 'g', 'g', ],
	['_', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'W', 'W', 'g', 'g', 'B', 'f', 'B', '.', 'g', 'g', ],
	['_', 'g', 'g', 'g', 'g', 'g', 't', 't', 'g', 'W', 'W', 'g', 'g', 'B', 'B', 'f', 'B', 'B', 'g', 'g', ],
	['_', 'g', 'g', 'g', 'g', 'g', 't', 'g', 'g', 'W', ',', 'g', 'g', 'B', 'f', 'f', 'f', 'B', 'g', 'g', ],
	['_', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'W', 'W', 'g', 'g', 'B', 'f', 'fh','f', 'B', 'g', 'g', ],
	['_', '_', 'g', 'g', 'g', 'g', 'g', 'g', 'W', '.', 'W', 'g', 'g', 'B', 'f', 'f', 'f', 'B', 'g', 'g', ],
	['g', '_', '_', 'g', 'g', 'g', 'g', 'W', 'W', 'g', 'W', 'g', 'g', 'B', 'B', 'B', 'B', 'B', 'g', 'g', ],
	['g', 'g', '_', 'g', 'g', 'g', 'g', 'W', 'gc','g', 'W', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', ],
	['g', 'g', '_', 'g', 'g', 'g', 'W', 'W', 'g', 'g', 'W', 'W', 'g', 'g', ':', 'g', 'g', 'g', 'g', 'g', ],
	['g', 'g', 'g', 'g', 'g', 'W', 'W', 'W', 'g', 'g', 'W', 'W', 'g', 'g', 'g', 'g', 't', 'g', 'g', 'g', ],
	['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'W', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', ],
];

function draw_image(dst, dst_x, dst_y, src, src_x, src_y, src_width, src_height) {
	dst.drawImage(src, src_x, src_y, src_width, src_height, dst_x, dst_y, src_width, src_height);
}

function draw_image_offset(dst, dst_x, dst_y, src, src_x, src_y, src_width, src_height, offset_x, offset_y) {
	if ((offset_x == 0) && (offset_y == 0)) {
		draw_image(dst, dst_x, dst_y, src, src_x, src_y, src_width, src_height);
		return;
	}
	if (offset_x < 0) {
		offset_x += src_width;
	} else if (offset_x >= src_width) {
		offset_x -= src_width;
	}
	if (offset_y < 0) {
		offset_y += src_height;
	} else if (offset_y >= src_height) {
		offset_y -= src_height;
	}
	draw_image(dst, dst_x, dst_y,
		src, src_x + src_width - offset_x, src_y + src_height - offset_y, offset_x, offset_y);
	draw_image(dst, dst_x + offset_x, dst_y,
		src, src_x, src_y + src_height - offset_y, src_width - offset_x, offset_y);
	draw_image(dst, dst_x, dst_y + offset_y,
		src, src_x + src_width - offset_x, src_y, offsetX, src_height - offset_y);
	draw_image(dst, dst_x + offset_x, dst_y + offset_y,
		src, src_x, src_y, src_width - offset_x, src_height - offset_y);
}

class Tile {
	constructor(kind, image, blocking, cycles, movable, filename) {
		this.kind = kind;
		this.image = image;
		this.blocking = blocking;
		this.cycles = cycles;
		this.movable = movable;
		this.filename = filename;
	}
}

var tiles = [
	new Tile( '0', null, true,  false, false, "player0.png"      ),
	new Tile( '1', null, true,  false, false, "player1.png"      ),
	new Tile( '2', null, true,  false, false, "player2.png"      ),
	new Tile( '3', null, true,  false, false, "player3.png"      ),
	new Tile( '4', null, true,  false, false, "player4.png"      ),
	new Tile( '5', null, true,  false, false, "player5.png"      ),
	new Tile( '6', null, true,  false, false, "player6.png"      ),
	new Tile( '7', null, true,  false, false, "player7.png"      ),
	new Tile( '8', null, true,  false, false, "player8.png"      ),
	new Tile( '9', null, true,  false, false, "player9.png"      ),
	new Tile( 'a', null, false, false, true,  "axe.png"          ),
	new Tile( 'B', null, true,  false, false, "brickwall.png"    ),
	new Tile( 'b', null, false, false, false, "bridge.png"       ),
	new Tile( 'c', null, false, false, true,  "cyanpotion.png"   ),
	new Tile( 'D', null, true,  false, false, "doorsclosed.png"  ),
	new Tile( 'd', null, false, false, false, "doorsopened.png"  ),
	new Tile( '_', null, false, false, false, "dirt.png"         ),
	new Tile( 'f', null, false, false, false, "flagstones.png"   ),
	new Tile( 'g', null, false, false, false, "grass.png"        ),
	new Tile( 'h', null, false, false, true,  "heartpotion.png"  ),
	new Tile( 'k', null, false, false, true,  "key.png"          ),
	new Tile( 'p', null, false, false, false, "pebbles.png"      ),
	new Tile( '.', null, false, false, false, "rocks1.png"       ),
	new Tile( ',', null, false, false, false, "rocks2.png"       ),
	new Tile( ':', null, false, false, false, "rocks3.png"       ),
	new Tile( ';', null, false, false, false, "rocks6.png"       ),
	new Tile( 's', null, false, false, false, "sand.png"         ),
	new Tile( 'S', null, true,  false, false, "stonewall.png"    ),
	new Tile( 't', null, false, false, false, "tree.png"         ),
	new Tile( 'W', null, true,  true,  false, "waterwaves.png"   ),
	new Tile( 'w', null, false, false, false, "woodenboards.png" ),
];

var player_tile = null;

function find_tile_by_kind(kind) {
	for (let t = 0; t < tiles.length; t++) {
		if (tiles[t].kind == kind) {
			return tiles[t];
		}
	}
	return null;
}

function last_blocking(kinds) {
	var blocking = false;
	for (kind of kinds) {
		var tile = find_tile_by_kind(kind);
		if (tile == null) {
			blocking = true;
		}
		blocking = tile.blocking;
	}
	return blocking;
}

async function load_all_tiles() {
	for (let t = 0; t < tiles.length; t++) {
		image = new Image();
		image.src = asset_path + tiles[t].filename;
		await image.decode();
		tiles[t].image = image;
	}
}

const SHA256_K = [
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
	0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
	0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
	0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
	0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
	0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
	0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
	0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
	0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function sha256_right_rotate(value, amount) {
	return (value >>> amount) | (value << (32 - amount));
}

function sha256_pad(message) {
	const msg = new TextEncoder().encode(message);
	const bitLength = msg.length * 8;
	const padLength = (msg.length + 9 + 63) & ~63;
	const out = new Uint8Array(padLength);

	out.set(msg, 0);
	out[msg.length] = 0x80;

	out[padLength - 8] = (bitLength >>> 56) & 0xff;
	out[padLength - 7] = (bitLength >>> 48) & 0xff;
	out[padLength - 6] = (bitLength >>> 40) & 0xff;
	out[padLength - 5] = (bitLength >>> 32) & 0xff;
	out[padLength - 4] = (bitLength >>> 24) & 0xff;
	out[padLength - 3] = (bitLength >>> 16) & 0xff;
	out[padLength - 2] = (bitLength >>> 8) & 0xff;
	out[padLength - 1] = bitLength & 0xff;

	return out;
}

function sha256_hex(message) {
	const padded = sha256_pad(message);
	let h0 = 0x6a09e667;
	let h1 = 0xbb67ae85;
	let h2 = 0x3c6ef372;
	let h3 = 0xa54ff53a;
	let h4 = 0x510e527f;
	let h5 = 0x9b05688c;
	let h6 = 0x1f83d9ab;
	let h7 = 0x5be0cd19;

	for (let offset = 0; offset < padded.length; offset += 64) {
		const chunk = padded.subarray(offset, offset + 64);
		const w = new Uint32Array(64);

		for (let i = 0; i < 16; i++) {
			w[i] = (chunk[i * 4] << 24) | (chunk[i * 4 + 1] << 16) | (chunk[i * 4 + 2] << 8) | chunk[i * 4 + 3];
		}

		for (let i = 16; i < 64; i++) {
			const s0 = sha256_right_rotate(w[i - 15], 7) ^ sha256_right_rotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
			const s1 = sha256_right_rotate(w[i - 2], 17) ^ sha256_right_rotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
			w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
		}

		let a = h0;
		let b = h1;
		let c = h2;
		let d = h3;
		let e = h4;
		let f = h5;
		let g = h6;
		let h = h7;

		for (let i = 0; i < 64; i++) {
			const S1 = sha256_right_rotate(e, 6) ^ sha256_right_rotate(e, 11) ^ sha256_right_rotate(e, 25);
			const ch = (e & f) ^ (~e & g);
			const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
			const S0 = sha256_right_rotate(a, 2) ^ sha256_right_rotate(a, 13) ^ sha256_right_rotate(a, 22);
			const maj = (a & b) ^ (a & c) ^ (b & c);
			const temp2 = (S0 + maj) >>> 0;

			h = g;
			g = f;
			f = e;
			e = (d + temp1) >>> 0;
			d = c;
			c = b;
			b = a;
			a = (temp1 + temp2) >>> 0;
		}

		h0 = (h0 + a) >>> 0;
		h1 = (h1 + b) >>> 0;
		h2 = (h2 + c) >>> 0;
		h3 = (h3 + d) >>> 0;
		h4 = (h4 + e) >>> 0;
		h5 = (h5 + f) >>> 0;
		h6 = (h6 + g) >>> 0;
		h7 = (h7 + h) >>> 0;
	}

	return [h0, h1, h2, h3, h4, h5, h6, h7]
		.map(v => v.toString(16).padStart(8, '0'))
		.join('');
}

async function sha256(message) {
	try {
		const subtle = globalThis.crypto?.subtle;
		if (subtle) {
			const encoded = new TextEncoder().encode(message);
			const buffer = await subtle.digest('SHA-256', encoded);
			return Array.from(new Uint8Array(buffer))
				.map(b => b.toString(16).padStart(2, '0'))
				.join('');
		}
	} catch (error) {
		console.warn('Web Crypto digest failed, using fallback SHA-256.', error);
	}

	return sha256_hex(message);
}

async function fetch_login_session(name, password) {
	try {
		var encrypted = await sha256(name + ';' + password);
		const response = await fetch(server_addr +
			`/login`, {
			method: 'POST',
			headers: {'Content-type': 'application/json; charset=UTF-8'},
			body: `{"name":"${name}", "encpswrd":"${encrypted}"}`
		});
		if (! response) {
			throw new Error(`HTTP error! login failed`);
		}
		if (! response.ok) {
			throw new Error(`HTTP error! login not ok status: ${response.status}`);
		}
		const result = await response.json();
		return result.session;
	} catch (error) {
		console.error('Error:', error);
		return '';
	}
}

async function fetch_logout(session) {
	try {
		const response = await fetch(server_addr +
			`/logout?session=${session}`, {
			method: 'GET',
			headers: {'Content-type': 'text/plain; charset=UTF-8'}
		});
		if (! response) {
			throw new Error(`HTTP error! logout failed`);
		}
		if (! response.ok) {
			throw new Error(`HTTP error! logout not ok status: ${response.status}`);
		}
		return await response.text();
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

function fix_x(x) {
	if (x < 0) {
		x += map_width;
	}
	if (x >= map_width) {
		x -= map_width;
	}
	return x;
}

function fix_y(y) {
	if (y < 0) {
		y = 0;
	}
	if (y >= map_height) {
		y = map_height - 1;
	}
	return y;
}

function get_map_yx(abs_y, abs_x) {
	if ((abs_y < 0) || (abs_y >= map_height)) {
		return ' ';
	}
	if ((abs_x < 0) || (abs_x >= map_width)) {
		return ' ';
	}
	return map[abs_y][abs_x];
}

function set_map_yx(abs_y, abs_x, kind) {
	if ((abs_y < 0) || (abs_y >= map_height)) {
		return;
	}
	if ((abs_x < 0) || (abs_x >= map_width)) {
		return;
	}
	map[abs_y][abs_x] = kind;
}

function set_map_row(abs_y, abs_left, row_window) {
	if ((abs_y < 0) || (abs_y >= map_height)) {
		return; // Outside the map, so ignore it.
	}
	for (let src_x = 0; src_x < row_window.length; src_x++) {
		let x = fix_x(abs_left + src_x);
		if ((x < 0) || (x >= map_width)) {
			continue; // Outside the map, so ignore it.
		}
		map[abs_y][x] = row_window[src_x];
	}
}

function set_map_window(abs_top, abs_left, abs_bottom, abs_right, map_data) {
	for (let src_y = 0; src_y < map_data.length; src_y++) {
		let row_window = map_data[src_y];
		set_map_row(abs_top + src_y, abs_left, row_window);
	}
}

async function fetch_map(y, x) {
	try {
		const response = await fetch(server_addr +
			`/info?y=${y}&x=${x}&session=${session}`, {
			method: 'GET',
			headers: {'Content-type': 'application/json; charset=UTF-8'}
		});
		if (! response) {
			throw new Error(`HTTP error! info failed`);
		}
		if (! response.ok) {
			throw new Error(`HTTP error! info not ok status: ${response.status}`);
		}
		if (response.status != 200) {
			throw new Error(`HTTP error! info not 200 status: ${response.status}`);
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

async function fetch_map_and_refresh() {
	const result = await fetch_map(posY, posX);
	if (! result) {
		return;
	}
	posX = result.x;
	posY = result.y;
	set_map_window(result.top, result.left, result.bottom, result.right, result.info);
}

async function move_request(dy, dx) {
	try {
		const response = await fetch(server_addr +
			`/move?dy=${dy}&dx=${dx}&session=${session}`, {
			method: 'GET',
			headers: {'Content-type': 'text/plain; charset=UTF-8'}
		});
		if (! response) {
			throw new Error(`HTTP error! move failed`);
		}
		if (response.status != 200) {
			console.log(`HTTP error! move not 200 status: ${response.status}`);
			return "blocked";
		}
		return await response.text();
	} catch (error) {
		console.error('Error:', error);
		return "error";
	}
}

async function use_request(dy, dx) {
	try {
		const response = await fetch(server_addr +
			`/use?dy=${dy}&dx=${dx}&session=${session}`, {
			method: 'GET',
			headers: {'Content-type': 'text/plain; charset=UTF-8'}
		});
		if (! response) {
			throw new Error(`HTTP error! use failed`);
		}
		if (response.status != 200) {
			console.log(`HTTP error! use not 200 status: ${response.status}`);
			return "";
		}
		return await response.text();
	} catch (error) {
		console.error('Error:', error);
		return "error";
	}
}

async function take_request() {
	try {
		const response = await fetch(server_addr +
			`/take?session=${session}`, {
			method: 'GET',
			headers: {'Content-type': 'text/plain; charset=UTF-8'}
		});
		if (! response) {
			throw new Error(`HTTP error! take failed`);
		}
		if (response.status != 200) {
			console.log(`HTTP error! take not 200 status: ${response.status}`);
			return "";
		}
		return await response.text();
	} catch (error) {
		console.error('Error:', error);
		return "error";
	}
}

async function place_request() {
	try {
		const response = await fetch(server_addr +
			`/place?session=${session}`, {
			method: 'GET',
			headers: {'Content-type': 'text/plain; charset=UTF-8'}
		});
		if (! response) {
			throw new Error(`HTTP error! place failed`);
		}
		if (response.status != 200) {
			console.log(`HTTP error! place not 200 status: ${response.status}`);
			return "";
		}
		return await response.text();
	} catch (error) {
		console.error('Error:', error);
		return "error";
	}
}

var gameArea = {
	canvas : document.getElementById("canvas"),
	server : document.getElementById("server"),
	nameInput : document.getElementById("name"),
	passwordInput : document.getElementById("password"),
	beginBtn : document.getElementById("begin"),
	display_map: function() {
		for (let y = 0; y < view_height; y++) {
			var srcY = y + posY - view_middleY;

			for (let x = 0; x < view_width; x++) {
				var srcX = x + posX - view_middleX;
				if (srcX < 0) {
					srcX += map_height;
				} else if (srcX >= map_height) {
					srcX -= map_height;
				}

				var dst_x  = x * tile_width;
				var dst_y  = y * tile_height;

				if ((srcY < 0) || (srcY >= map_height)) {
					this.context.fillStyle = "black"
					this.context.fillRect(dst_x, dst_y, tile_width, tile_height);
					continue;
				}

				var kinds = get_map_yx(srcY, srcX);

				for (const kind of kinds) {
					var tile = find_tile_by_kind(kind);
					if ((tile == null) || (tile.image == null)) {
						this.context.fillStyle = "black";
						this.context.fillRect(dst_x, dst_y, tile_width, tile_height);
						continue;
					}
					var image = tile.image;
					if (tile.cycles) {
						draw_image_offset(this.context, dst_x, dst_y,
							image, 0, 0, tile_width, tile_height,
							offsetX, offsetY);
					} else {
						draw_image(this.context, dst_x, dst_y,
							image, 0, 0, tile_width, tile_height);
					}
				}
			}
		}
	},
	display_players: function() {
		var image = player_tile.image;
		draw_image(this.context, playerX * tile_width, playerY * tile_height,
			image, 0, 0, tile_width, tile_height);
	},
	draw_all: function() {
		this.display_map();
		if (! this.isLoggedIn()) {
			this.display_players();
		}
	},
	cycle_graphics: function() {
		// Cycle the offset.
		offsetX += windX;
		offsetY += windY;
		if (offsetX < 0) {
			offsetX += tile_width;
		} else if (offsetX >= tile_width) {
			offsetX = 0;
		}
		if (offsetY < 0) {
			offsetY += tile_height;
		} else if (offsetY >= tile_height) {
			offsetY = 0;
		}
	},
	poll_map: function() {
		polling_counter += animation_time;
		if (polling_counter >= polling_time) {
			polling_counter = 0;
			if (this.isLoggedIn()) {
				fetch_map_and_refresh();
			}
		}
	},
	update: function() {
		this.cycle_graphics();
		this.poll_map();
		this.draw_all();
	},
	init_timer: function () {
		var me = this;
		var time_loop = function () {
			me.update();
			me.timer = setTimeout(time_loop, animation_time);
		};
		this.timer = setTimeout(time_loop, animation_time);
	},
	bind_key_events: function () {
		var me = this;
		var key_event = "keypress";
		if (this.isSafari() || this.isIE()) {
			key_event = "keydown";
		}
		var key_handler = function (e) {
			me.handle_key(e);
		};
		if (window.addEventListener) {
			this.canvas.addEventListener(key_event, key_handler, false);
		} else {
			this.canvas.attachEvent("on" + key_event, key_handler);
		}
	},
	bind_mouse_events: function () {
		var me = this;
		var mouse_handler = function (e) {
			me.handle_mouse(e);
		};
		var wheel_handler = function (e) {
			me.handle_mouse_wheel(e);
		};
		var begin_handler = function (e) {
			me.handle_begin(e);
		};
		if (window.addEventListener) {
			this.canvas.addEventListener("click", mouse_handler, false);
			this.canvas.addEventListener("wheel", wheel_handler, false);
			this.beginBtn.addEventListener("click", begin_handler, false);
		} else {
			this.canvas.attachEvent("onclick", mouse_handler);
			this.canvas.attachEvent("wheel", wheel_handler);
			this.beginBtn.attachEvent("onclick", begin_handler);
		}
	},
	fix_pos: function() {
		posX = fix_x(posX);
		posY = fix_y(posY);
	},
	move_character: function(dy, dx) {
		const kinds = get_map_yx(fix_y(posY + dy), fix_x(posX + dx));
		if (! last_blocking(kinds)) {
			posY += dy;
			posX += dx;
			this.fix_pos();
		}

		// Tell server about the move.
		move_request(dy, dx);
	},
	take_item: function() {
		take_request();
	},
	place_item: function() {
		place_request();
	},
	handle_key: function (e) {
		var key = this.get_key(e);
		switch (key) {
			case 65: // A
			case 37: // left arrow
				this.move_character(-0, -1);
				break;
			case 87: // W
			case 38: // up arrow
				this.move_character(-1, -0);
				break;
			case 68: // D
			case 39: // right arrow
				this.move_character(+0, +1);
				break;
			case 83: // S
			case 40: // down arrow
				this.move_character(+1, +0);
				break;
			case 84: // T
				this.take_item();
				break;
			case 80: // P
				this.place_item();
				break;
			case 27: // escape key
				break;
			case 32: // space key
				break;
			default:
				break;
		}
		fetch_map_and_refresh();		
	},
	get_key: function (e) {
		if (window.event) {
			return window.event.keyCode;
		} else if (e) {
			return e.keyCode;
		}
		return 0;
	},
	get_canvas_coords: function(e) {
		const rect = this.canvas.getBoundingClientRect();
		const scaleX = this.canvas.width / rect.width;
		const scaleY = this.canvas.height / rect.height;
		const x = (e.clientX - rect.left) * scaleX;
		const y = (e.clientY - rect.top) * scaleY;
		return { y, x };
	},
	handle_mouse: function (e) {
		var yx = this.get_canvas_coords(e);
		var y = parseInt(yx.y / tile_height);
		var x = parseInt(yx.x / tile_width);
		if ((y < 0) || (y > view_height)) {
			return;
		}
		if ((x < 0) || (x > view_width)) {
			return;
		}
		console.log('Mouse click y=' + y + ' x=' + x);
		use_request(y - playerY, x - playerX);
	},
	handle_mouse_wheel: function (e) {
		console.log('Mouse wheel deltaY=' + e.deltaY + ' deltaX=' + e.deltaX);
	},
	handle_reset: function (e) {
		this.reset();
	},
	handle_begin: function (e) {
		this.begin();
	},
	isIE: function () {
		return this.browserTest(/IE/);
	},
	isFirefox: function () {
		return this.browserTest(/Firefox/);
	},
	isSafari: function () {
		return this.browserTest(/Safari/);
	},
	browserTest: function (rgx) {
		return rgx.test(navigator.userAgent);
	},
	isLoggedIn() {
		return session != ''
	},
	async login() {
		this.reset();
		// attempt to log in
		var name = this.nameInput.value;
		var password = this.passwordInput.value;
		session = await fetch_login_session(name, password);
		if (session != '') {
			fetch_map_and_refresh();
			this.beginBtn.innerText = 'Log out';
		}
	},
	async logout() {
		this.reset();
		// attempt to log out
		result = await fetch_logout(session);
		if (result != null) {
			session = "";
			this.beginBtn.innerText = 'Begin Questing';
		}
	},
	begin() {
		if (this.isLoggedIn()) {
			this.logout();
		} else {
			this.login();
		}
	},
	reset: function() {
		this.canvas.focus();
		if (!this.server.value || this.server.value === "http://localhost:8000") {
			this.server.value = server_addr;
		}
		server_addr = this.server.value || window.location.origin;
	},
	start : function() {
		this.canvas.width = default_width;
		this.canvas.height = default_height;
		this.context = this.canvas.getContext("2d");
		this.bind_key_events();
		this.bind_mouse_events();
		this.init_timer();
		this.reset();
	}
};

async function startGame() {
	await load_all_tiles();
	player_tile = find_tile_by_kind('1');
	gameArea.start();
}

