/**
 * @author alteredq / http://alteredqualia.com/
 */

import {
  Face3,
  Geometry,
  Loader,
  Vector2,
  Vector3,
  DefaultLoadingManager,
  FileLoader,
  LoaderUtils
} from "three/build/three.module.js";

var BinaryLoader = (function() {
  function BinaryLoader(manager) {
    if (typeof manager === "boolean") {
      console.warn(
        "THREE.BinaryLoader: showStatus parameter has been removed from constructor."
      );
      manager = undefined;
    }

    this.manager = manager !== undefined ? manager : DefaultLoadingManager;

    this.withCredentials = false;
  }

  Object.assign(BinaryLoader.prototype, {
    crossOrigin: "anonymous",

    // get statusDomElement() {
    //   if (this._statusDomElement === undefined) {
    //     this._statusDomElement = document.createElement("div");
    //   }

    //   console.warn("THREE.BinaryLoader: .statusDomElement has been removed.");
    //   return this._statusDomElement;
    // },

    load: function(url, onLoad, onProgress, onError) {
      var texturePath = this.texturePath || LoaderUtils.extractUrlBase(url);
      var binaryPath = this.binaryPath || LoaderUtils.extractUrlBase(url);

      var scope = this;

      var loader = new FileLoader(this.manager);
      loader.setPath(this.path);
      loader.setWithCredentials(this.withCredentials);
      loader.load(
        url,
        function(data) {
          var json = JSON.parse(data);

          var bufferUrl = binaryPath + json.buffers;

          var bufferLoader = new FileLoader(scope.manager);
          bufferLoader.setResponseType("arraybuffer");
          bufferLoader.load(
            bufferUrl,
            function(bufData) {
             var object = scope.parse(bufData, onLoad, texturePath, json.materials);
             onLoad(object.geometry)
            },
            onProgress,
            onError
          );
        },
        onProgress,
        onError
      );
    },

    setBinaryPath: function(value) {
      this.binaryPath = value;
    },

    setCrossOrigin: function(value) {
      this.crossOrigin = value;
    },

    setTexturePath: function(value) {
      this.texturePath = value;
    },

    parse: function(data, texturePath) {
      var Model = function(texturePath) {
        var scope = this,
          currentOffset = 0,
          md,
          normals = [],
          uvs = [],
          start_tri_flat,
          start_tri_smooth,
          start_tri_flat_uv,
          start_tri_smooth_uv,
          start_quad_flat,
          start_quad_smooth,
          start_quad_flat_uv,
          start_quad_smooth_uv,
          tri_size,
          quad_size,
          len_tri_flat,
          len_tri_smooth,
          len_tri_flat_uv,
          len_tri_smooth_uv,
          len_quad_flat,
          len_quad_smooth,
          len_quad_flat_uv,
          len_quad_smooth_uv;

        Geometry.call(this);

        md = parseMetaData(data, currentOffset);

        currentOffset += md.header_bytes;
        /*
						  md.vertex_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
						  md.material_index_bytes = Uint16Array.BYTES_PER_ELEMENT;
						  md.normal_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
						  md.uv_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
				  */
        // buffers sizes

        tri_size = md.vertex_index_bytes * 3 + md.material_index_bytes;
        quad_size = md.vertex_index_bytes * 4 + md.material_index_bytes;

        len_tri_flat = md.ntri_flat * tri_size;
        len_tri_smooth =
          md.ntri_smooth * (tri_size + md.normal_index_bytes * 3);
        len_tri_flat_uv = md.ntri_flat_uv * (tri_size + md.uv_index_bytes * 3);
        len_tri_smooth_uv =
          md.ntri_smooth_uv *
          (tri_size + md.normal_index_bytes * 3 + md.uv_index_bytes * 3);

        len_quad_flat = md.nquad_flat * quad_size;
        len_quad_smooth =
          md.nquad_smooth * (quad_size + md.normal_index_bytes * 4);
        len_quad_flat_uv =
          md.nquad_flat_uv * (quad_size + md.uv_index_bytes * 4);
        len_quad_smooth_uv =
          md.nquad_smooth_uv *
          (quad_size + md.normal_index_bytes * 4 + md.uv_index_bytes * 4);

        // read buffers

        currentOffset += init_vertices(currentOffset);

        currentOffset += init_normals(currentOffset);
        currentOffset += handlePadding(md.nnormals * 3);

        currentOffset += init_uvs(currentOffset);

        start_tri_flat = currentOffset;
        start_tri_smooth =
          start_tri_flat + len_tri_flat + handlePadding(md.ntri_flat * 2);
        start_tri_flat_uv =
          start_tri_smooth + len_tri_smooth + handlePadding(md.ntri_smooth * 2);
        start_tri_smooth_uv =
          start_tri_flat_uv +
          len_tri_flat_uv +
          handlePadding(md.ntri_flat_uv * 2);

        start_quad_flat =
          start_tri_smooth_uv +
          len_tri_smooth_uv +
          handlePadding(md.ntri_smooth_uv * 2);
        start_quad_smooth =
          start_quad_flat + len_quad_flat + handlePadding(md.nquad_flat * 2);
        start_quad_flat_uv =
          start_quad_smooth +
          len_quad_smooth +
          handlePadding(md.nquad_smooth * 2);
        start_quad_smooth_uv =
          start_quad_flat_uv +
          len_quad_flat_uv +
          handlePadding(md.nquad_flat_uv * 2);

        // have to first process faces with uvs
        // so that face and uv indices match

        init_triangles_flat_uv(start_tri_flat_uv);
        init_triangles_smooth_uv(start_tri_smooth_uv);

        init_quads_flat_uv(start_quad_flat_uv);
        init_quads_smooth_uv(start_quad_smooth_uv);

        // now we can process untextured faces

        init_triangles_flat(start_tri_flat);
        init_triangles_smooth(start_tri_smooth);

        init_quads_flat(start_quad_flat);
        init_quads_smooth(start_quad_smooth);

        this.computeFaceNormals();

        function handlePadding(n) {
          return n % 4 ? 4 - (n % 4) : 0;
        }

        function parseMetaData(data, offset) {
          var metaData = {
            signature: parseString(data, offset, 12),
            header_bytes: parseUChar8(data, offset + 12),

            vertex_coordinate_bytes: parseUChar8(data, offset + 13),
            normal_coordinate_bytes: parseUChar8(data, offset + 14),
            uv_coordinate_bytes: parseUChar8(data, offset + 15),

            vertex_index_bytes: parseUChar8(data, offset + 16),
            normal_index_bytes: parseUChar8(data, offset + 17),
            uv_index_bytes: parseUChar8(data, offset + 18),
            material_index_bytes: parseUChar8(data, offset + 19),

            nvertices: parseUInt32(data, offset + 20),
            nnormals: parseUInt32(data, offset + 20 + 4 * 1),
            nuvs: parseUInt32(data, offset + 20 + 4 * 2),

            ntri_flat: parseUInt32(data, offset + 20 + 4 * 3),
            ntri_smooth: parseUInt32(data, offset + 20 + 4 * 4),
            ntri_flat_uv: parseUInt32(data, offset + 20 + 4 * 5),
            ntri_smooth_uv: parseUInt32(data, offset + 20 + 4 * 6),

            nquad_flat: parseUInt32(data, offset + 20 + 4 * 7),
            nquad_smooth: parseUInt32(data, offset + 20 + 4 * 8),
            nquad_flat_uv: parseUInt32(data, offset + 20 + 4 * 9),
            nquad_smooth_uv: parseUInt32(data, offset + 20 + 4 * 10)
          };
          return metaData;
        }

        function parseString(data, offset, length) {
          var charArray = new Uint8Array(data, offset, length);

          var text = "";

          for (var i = 0; i < length; i++) {
            text += String.fromCharCode(charArray[offset + i]);
          }

          return text;
        }

        function parseUChar8(data, offset) {
          var charArray = new Uint8Array(data, offset, 1);

          return charArray[0];
        }

        function parseUInt32(data, offset) {
          var intArray = new Uint32Array(data, offset, 1);

          return intArray[0];
        }

        function init_vertices(start) {
          var nElements = md.nvertices;

          var coordArray = new Float32Array(data, start, nElements * 3);

          var i, x, y, z;

          for (i = 0; i < nElements; i++) {
            x = coordArray[i * 3];
            y = coordArray[i * 3 + 1];
            z = coordArray[i * 3 + 2];

            scope.vertices.push(new Vector3(x, y, z));
          }

          return nElements * 3 * Float32Array.BYTES_PER_ELEMENT;
        }

        function init_normals(start) {
          var nElements = md.nnormals;

          if (nElements) {
            var normalArray = new Int8Array(data, start, nElements * 3);

            var i, x, y, z;

            for (i = 0; i < nElements; i++) {
              x = normalArray[i * 3];
              y = normalArray[i * 3 + 1];
              z = normalArray[i * 3 + 2];

              normals.push(x / 127, y / 127, z / 127);
            }
          }

          return nElements * 3 * Int8Array.BYTES_PER_ELEMENT;
        }

        function init_uvs(start) {
          var nElements = md.nuvs;

          if (nElements) {
            var uvArray = new Float32Array(data, start, nElements * 2);

            var i, u, v;

            for (i = 0; i < nElements; i++) {
              u = uvArray[i * 2];
              v = uvArray[i * 2 + 1];

              uvs.push(u, v);
            }
          }

          return nElements * 2 * Float32Array.BYTES_PER_ELEMENT;
        }

        function init_uvs3(nElements, offset) {
          var i, uva, uvb, uvc, u1, u2, u3, v1, v2, v3;

          var uvIndexBuffer = new Uint32Array(data, offset, 3 * nElements);

          for (i = 0; i < nElements; i++) {
            uva = uvIndexBuffer[i * 3];
            uvb = uvIndexBuffer[i * 3 + 1];
            uvc = uvIndexBuffer[i * 3 + 2];

            u1 = uvs[uva * 2];
            v1 = uvs[uva * 2 + 1];

            u2 = uvs[uvb * 2];
            v2 = uvs[uvb * 2 + 1];

            u3 = uvs[uvc * 2];
            v3 = uvs[uvc * 2 + 1];

            scope.faceVertexUvs[0].push([
              new Vector2(u1, v1),
              new Vector2(u2, v2),
              new Vector2(u3, v3)
            ]);
          }
        }

        function init_uvs4(nElements, offset) {
          var i, uva, uvb, uvc, uvd, u1, u2, u3, u4, v1, v2, v3, v4;

          var uvIndexBuffer = new Uint32Array(data, offset, 4 * nElements);

          for (i = 0; i < nElements; i++) {
            uva = uvIndexBuffer[i * 4];
            uvb = uvIndexBuffer[i * 4 + 1];
            uvc = uvIndexBuffer[i * 4 + 2];
            uvd = uvIndexBuffer[i * 4 + 3];

            u1 = uvs[uva * 2];
            v1 = uvs[uva * 2 + 1];

            u2 = uvs[uvb * 2];
            v2 = uvs[uvb * 2 + 1];

            u3 = uvs[uvc * 2];
            v3 = uvs[uvc * 2 + 1];

            u4 = uvs[uvd * 2];
            v4 = uvs[uvd * 2 + 1];

            scope.faceVertexUvs[0].push([
              new Vector2(u1, v1),
              new Vector2(u2, v2),
              new Vector2(u4, v4)
            ]);

            scope.faceVertexUvs[0].push([
              new Vector2(u2, v2),
              new Vector2(u3, v3),
              new Vector2(u4, v4)
            ]);
          }
        }

        function init_faces3_flat(nElements, offsetVertices, offsetMaterials) {
          var i, a, b, c, m;

          var vertexIndexBuffer = new Uint32Array(
            data,
            offsetVertices,
            3 * nElements
          );
          var materialIndexBuffer = new Uint16Array(
            data,
            offsetMaterials,
            nElements
          );

          for (i = 0; i < nElements; i++) {
            a = vertexIndexBuffer[i * 3];
            b = vertexIndexBuffer[i * 3 + 1];
            c = vertexIndexBuffer[i * 3 + 2];

            m = materialIndexBuffer[i];

            scope.faces.push(new Face3(a, b, c, null, null, m));
          }
        }

        function init_faces4_flat(nElements, offsetVertices, offsetMaterials) {
          var i, a, b, c, d, m;

          var vertexIndexBuffer = new Uint32Array(
            data,
            offsetVertices,
            4 * nElements
          );
          var materialIndexBuffer = new Uint16Array(
            data,
            offsetMaterials,
            nElements
          );

          for (i = 0; i < nElements; i++) {
            a = vertexIndexBuffer[i * 4];
            b = vertexIndexBuffer[i * 4 + 1];
            c = vertexIndexBuffer[i * 4 + 2];
            d = vertexIndexBuffer[i * 4 + 3];

            m = materialIndexBuffer[i];

            scope.faces.push(new Face3(a, b, d, null, null, m));
            scope.faces.push(new Face3(b, c, d, null, null, m));
          }
        }

        function init_faces3_smooth(
          nElements,
          offsetVertices,
          offsetNormals,
          offsetMaterials
        ) {
          var i, a, b, c, m;
          var na, nb, nc;

          var vertexIndexBuffer = new Uint32Array(
            data,
            offsetVertices,
            3 * nElements
          );
          var normalIndexBuffer = new Uint32Array(
            data,
            offsetNormals,
            3 * nElements
          );
          var materialIndexBuffer = new Uint16Array(
            data,
            offsetMaterials,
            nElements
          );

          for (i = 0; i < nElements; i++) {
            a = vertexIndexBuffer[i * 3];
            b = vertexIndexBuffer[i * 3 + 1];
            c = vertexIndexBuffer[i * 3 + 2];

            na = normalIndexBuffer[i * 3];
            nb = normalIndexBuffer[i * 3 + 1];
            nc = normalIndexBuffer[i * 3 + 2];

            m = materialIndexBuffer[i];

            var nax = normals[na * 3],
              nay = normals[na * 3 + 1],
              naz = normals[na * 3 + 2],
              nbx = normals[nb * 3],
              nby = normals[nb * 3 + 1],
              nbz = normals[nb * 3 + 2],
              ncx = normals[nc * 3],
              ncy = normals[nc * 3 + 1],
              ncz = normals[nc * 3 + 2];

            scope.faces.push(
              new Face3(
                a,
                b,
                c,
                [
                  new Vector3(nax, nay, naz),
                  new Vector3(nbx, nby, nbz),
                  new Vector3(ncx, ncy, ncz)
                ],
                null,
                m
              )
            );
          }
        }

        function init_faces4_smooth(
          nElements,
          offsetVertices,
          offsetNormals,
          offsetMaterials
        ) {
          var i, a, b, c, d, m;
          var na, nb, nc, nd;

          var vertexIndexBuffer = new Uint32Array(
            data,
            offsetVertices,
            4 * nElements
          );
          var normalIndexBuffer = new Uint32Array(
            data,
            offsetNormals,
            4 * nElements
          );
          var materialIndexBuffer = new Uint16Array(
            data,
            offsetMaterials,
            nElements
          );

          for (i = 0; i < nElements; i++) {
            a = vertexIndexBuffer[i * 4];
            b = vertexIndexBuffer[i * 4 + 1];
            c = vertexIndexBuffer[i * 4 + 2];
            d = vertexIndexBuffer[i * 4 + 3];

            na = normalIndexBuffer[i * 4];
            nb = normalIndexBuffer[i * 4 + 1];
            nc = normalIndexBuffer[i * 4 + 2];
            nd = normalIndexBuffer[i * 4 + 3];

            m = materialIndexBuffer[i];

            var nax = normals[na * 3],
              nay = normals[na * 3 + 1],
              naz = normals[na * 3 + 2],
              nbx = normals[nb * 3],
              nby = normals[nb * 3 + 1],
              nbz = normals[nb * 3 + 2],
              ncx = normals[nc * 3],
              ncy = normals[nc * 3 + 1],
              ncz = normals[nc * 3 + 2],
              ndx = normals[nd * 3],
              ndy = normals[nd * 3 + 1],
              ndz = normals[nd * 3 + 2];

            scope.faces.push(
              new Face3(
                a,
                b,
                d,
                [
                  new Vector3(nax, nay, naz),
                  new Vector3(nbx, nby, nbz),
                  new Vector3(ndx, ndy, ndz)
                ],
                null,
                m
              )
            );

            scope.faces.push(
              new Face3(
                b,
                c,
                d,
                [
                  new Vector3(nbx, nby, nbz),
                  new Vector3(ncx, ncy, ncz),
                  new Vector3(ndx, ndy, ndz)
                ],
                null,
                m
              )
            );
          }
        }

        function init_triangles_flat(start) {
          var nElements = md.ntri_flat;

          if (nElements) {
            var offsetMaterials =
              start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
            init_faces3_flat(nElements, start, offsetMaterials);
          }
        }

        function init_triangles_flat_uv(start) {
          var nElements = md.ntri_flat_uv;

          if (nElements) {
            var offsetUvs =
              start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
            var offsetMaterials =
              offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

            init_faces3_flat(nElements, start, offsetMaterials);
            init_uvs3(nElements, offsetUvs);
          }
        }

        function init_triangles_smooth(start) {
          var nElements = md.ntri_smooth;

          if (nElements) {
            var offsetNormals =
              start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
            var offsetMaterials =
              offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

            init_faces3_smooth(
              nElements,
              start,
              offsetNormals,
              offsetMaterials
            );
          }
        }

        function init_triangles_smooth_uv(start) {
          var nElements = md.ntri_smooth_uv;

          if (nElements) {
            var offsetNormals =
              start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
            var offsetUvs =
              offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
            var offsetMaterials =
              offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

            init_faces3_smooth(
              nElements,
              start,
              offsetNormals,
              offsetMaterials
            );
            init_uvs3(nElements, offsetUvs);
          }
        }

        function init_quads_flat(start) {
          var nElements = md.nquad_flat;

          if (nElements) {
            var offsetMaterials =
              start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
            init_faces4_flat(nElements, start, offsetMaterials);
          }
        }

        function init_quads_flat_uv(start) {
          var nElements = md.nquad_flat_uv;

          if (nElements) {
            var offsetUvs =
              start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
            var offsetMaterials =
              offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

            init_faces4_flat(nElements, start, offsetMaterials);
            init_uvs4(nElements, offsetUvs);
          }
        }

        function init_quads_smooth(start) {
          var nElements = md.nquad_smooth;

          if (nElements) {
            var offsetNormals =
              start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
            var offsetMaterials =
              offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

            init_faces4_smooth(
              nElements,
              start,
              offsetNormals,
              offsetMaterials
            );
          }
        }

        function init_quads_smooth_uv(start) {
          var nElements = md.nquad_smooth_uv;

          if (nElements) {
            var offsetNormals =
              start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
            var offsetUvs =
              offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
            var offsetMaterials =
              offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

            init_faces4_smooth(
              nElements,
              start,
              offsetNormals,
              offsetMaterials
            );
            init_uvs4(nElements, offsetUvs);
          }
        }
      };

      Model.prototype = Object.create(Geometry.prototype);
      Model.prototype.constructor = Model;

      var geometry = new Model(texturePath);
      var geometry = new Model(texturePath);
      return { geometry: geometry };
    }
  });

  return BinaryLoader;
})();
export { BinaryLoader };
