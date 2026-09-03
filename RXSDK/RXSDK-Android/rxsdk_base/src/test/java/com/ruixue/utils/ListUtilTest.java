package com.ruixue.utils;

import com.ruixue.support.BaseUnitTest;

import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

/**
 * ListUtil 单元测试：isEmpty、defaultIfNull、partition、intersection、union、removeAll、retainAll、isEqualList、hashCodeForList 等。
 */
public class ListUtilTest extends BaseUnitTest {

    @Test
    public void testIsEmpty_null() {
        assertTrue(ListUtil.isEmpty(null));
    }

    @Test
    public void testIsEmpty_emptyList() {
        assertTrue(ListUtil.isEmpty(Collections.emptyList()));
    }

    @Test
    public void testIsEmpty_nonEmpty() {
        assertFalse(ListUtil.isEmpty(Arrays.asList(1)));
    }

    @Test
    public void testIsNotEmpty_null() {
        assertFalse(ListUtil.isNotEmpty(null));
    }

    @Test
    public void testIsNotEmpty_nonEmpty() {
        assertTrue(ListUtil.isNotEmpty(Arrays.asList(1, 2)));
    }

    @Test
    public void testDefaultIfNull_returnsDefaultWhenNull() {
        List<String> def = Arrays.asList("a");
        assertSame(def, ListUtil.defaultIfNull(null, def));
    }

    @Test
    public void testDefaultIfNull_returnsListWhenNotNull() {
        List<String> list = Arrays.asList("b");
        assertSame(list, ListUtil.defaultIfNull(list, Arrays.asList("a")));
    }

    @Test
    public void testEmptyIfNull_returnsEmptyWhenNull() {
        assertEquals(Collections.emptyList(), ListUtil.emptyIfNull(null));
    }

    @Test
    public void testEmptyIfNull_returnsSameWhenNotNull() {
        List<Integer> list = Arrays.asList(1);
        assertSame(list, ListUtil.emptyIfNull(list));
    }

    @Test
    public void testGetFirst() {
        assertEquals("a", ListUtil.getFirst(Arrays.asList("a", "b")));
    }

    @Test
    public void testGetLast() {
        assertEquals("b", ListUtil.getLast(Arrays.asList("a", "b")));
    }

    @Test
    public void testHashCodeForList_null() {
        assertEquals(0, ListUtil.hashCodeForList(null));
    }

    @Test
    public void testHashCodeForList_consistentWithListHashCode() {
        List<String> list = Arrays.asList("x", "y");
        assertEquals(list.hashCode(), ListUtil.hashCodeForList(list));
    }

    @Test
    public void testIntersection() {
        List<Integer> a = Arrays.asList(1, 2, 3);
        List<Integer> b = Arrays.asList(2, 3, 4);
        assertEquals(Arrays.asList(2, 3), ListUtil.intersection(a, b));
    }

    @Test
    public void testIsEqualList_sameRef() {
        List<String> list = Arrays.asList("a");
        assertTrue(ListUtil.isEqualList(list, list));
    }

    @Test
    public void testIsEqualList_nullNull() {
        assertTrue(ListUtil.isEqualList(null, null));
    }

    @Test
    public void testIsEqualList_nullAndNonEmpty() {
        assertFalse(ListUtil.isEqualList(null, Arrays.asList(1)));
        assertFalse(ListUtil.isEqualList(Arrays.asList(1), null));
    }

    @Test
    public void testIsEqualList_equalContent() {
        assertTrue(ListUtil.isEqualList(Arrays.asList(1, 2), Arrays.asList(1, 2)));
    }

    @Test
    public void testIsEqualList_differentSize() {
        assertFalse(ListUtil.isEqualList(Arrays.asList(1), Arrays.asList(1, 2)));
    }

    @Test
    public void testPartition() {
        List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
        List<List<Integer>> parts = ListUtil.partition(list, 2);
        assertEquals(3, parts.size());
        assertEquals(Arrays.asList(1, 2), parts.get(0));
        assertEquals(Arrays.asList(3, 4), parts.get(1));
        assertEquals(Arrays.asList(5), parts.get(2));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testPartition_invalidSizeZero() {
        ListUtil.partition(Arrays.asList(1), 0);
    }

    @Test(expected = NullPointerException.class)
    public void testPartition_nullList() {
        ListUtil.partition(null, 1);
    }

    @Test
    public void testRemoveAll() {
        List<String> col = Arrays.asList("a", "b", "c");
        List<String> remove = Arrays.asList("b");
        assertEquals(Arrays.asList("a", "c"), ListUtil.removeAll(col, remove));
    }

    @Test
    public void testRetainAll() {
        List<String> col = Arrays.asList("a", "b", "c");
        List<String> retain = Arrays.asList("b", "c", "d");
        assertEquals(Arrays.asList("b", "c"), ListUtil.retainAll(col, retain));
    }

    @Test
    public void testUnion() {
        List<String> a = Arrays.asList("a", "b");
        List<String> b = Arrays.asList("c");
        assertEquals(Arrays.asList("a", "b", "c"), ListUtil.union(a, b));
    }

    @Test
    public void testSynchronizedList() {
        List<String> list = new ArrayList<>(Arrays.asList("x"));
        List<String> syn = ListUtil.synchronizedList(list);
        assertEquals("x", syn.get(0));
        syn.add("y");
        assertEquals(2, list.size());
    }
}
